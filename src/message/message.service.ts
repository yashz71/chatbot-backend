import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { AgentResponse, AgentService } from 'src/agent/agent.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Express } from 'express';
import FormData from 'form-data';

@Injectable()
export class MessageService {
  private msgRepo: Repository<Message>;

  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    private agentService: AgentService,
    private readonly httpService: HttpService,
  ) {
    this.msgRepo = this.dataSource.getRepository(Message);
  }

  async uploadPdf(file: Express.Multer.File, threadId: string) {
    const formData = new FormData();

    formData.append('file', file.buffer, file.originalname);
    formData.append('thread_id', threadId);

    const ingestion = await this.httpService.axiosRef.post(
      'http://localhost:8000/ingest',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    return ingestion.status;
  }

  async handleUserMessage(
    userId: number,
    threadId: string,
    text: string,
    file?: Express.Multer.File,
  ) {
    const messageRecord = await this.msgRepo.save({
      humanMessage: text,
      threadId,
      userId,
      status: 'pending',
    });

    try {
      let aiResponse: AgentResponse;

      // CASE 1: file exists
      if (file) {
        const formData = new FormData();

        formData.append('message', text);
        formData.append('thread_id', threadId);

        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });

        aiResponse = await firstValueFrom(
          this.agentService.sendChatWithFile(formData),
        );
      }

      // CASE 2: no file
      else {
        const formData = new FormData();

        formData.append('message', text);
        formData.append('thread_id', threadId);

        aiResponse = await firstValueFrom(
          this.agentService.getAgentResponse(formData),
        );
      }

      await this.msgRepo.update(messageRecord.id, {
        aiMessage: aiResponse.answer,
        status: 'sent',
      });

      return {
        ...(await this.msgRepo.findOneBy({ id: messageRecord.id })),
        download_url: aiResponse.download_url || null,
        thread_id: aiResponse.thread_id,
      };
    } catch (error) {
      console.log(error);

      await this.msgRepo.update(messageRecord.id, {
        status: 'error',
      });

      throw new InternalServerErrorException(
        'The finance agent is currently unavailable.',
      );
    }
  }

  async findAllByThread(threadId: string) {
    return await this.msgRepo.find({
      where: { threadId },
      order: { createdAt: 'ASC' },
    });
  }

  async findUserThreads(userId: number) {
    const rawThreads = await this.msgRepo
      .createQueryBuilder('message')
      .distinctOn(['message.threadId'])
      .addSelect('message.humanMessage', 'title')
      .addSelect('message.createdAt', 'createdAt')
      .where('message.userId = :userId', { userId })
      .andWhere('message.status != :status', { status: 'error' })
      .orderBy('message.threadId')
      .addOrderBy('message.createdAt', 'DESC')
      .getRawMany();

    return rawThreads.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}