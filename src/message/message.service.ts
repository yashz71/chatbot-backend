import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { AgentService } from 'src/agent/agent.service';
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
    private readonly httpService: HttpService
      ) {
    this.msgRepo = this.dataSource.getRepository(Message);
  }
  
  async uploadPdf(file: Express.Multer.File, threadId: string) {
    // 1. mark thread as processing
  
    // 2. forward to FastAPI
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('thread_id', threadId);
  
   const ingestion= await this.httpService.axiosRef.post('http://localhost:8000/ingest', formData, {
      headers: formData.getHeaders(),
    });
  
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
      let aiResponseString: string;
  
      // 🔥 CASE 1: file exists → send multipart to FastAPI
      if (file) {
        const formData = new FormData();
  
        formData.append('message', text);
        formData.append('thread_id', threadId);
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });        
        console.log("formData: ",formData);
        aiResponseString = await firstValueFrom( this.agentService.sendChatWithFile(formData))
      }
  
      // 🔥 CASE 2: no file → normal chat
      else {
        const formData1= new FormData();
  
        formData1.append('message', text);
        formData1.append('thread_id', threadId);
        console.log("formData1:", formData1)
        aiResponseString = await firstValueFrom(
        
          this.agentService.getAgentResponse(formData1)
        );
      }
  
      await this.msgRepo.update(messageRecord.id, {
        aiMessage: aiResponseString,
        status: 'sent',
      });
  
      return this.msgRepo.findOneBy({ id: messageRecord.id });
  
    } catch (error) {
      console.log(error);

      await this.msgRepo.update(messageRecord.id, { status: 'error' });
  
      throw new InternalServerErrorException(
        "The finance agent is currently unavailable."
      );
    }
  }
  async findAllByThread(threadId: string){
    return await this.msgRepo.find({ where: { threadId },order: { createdAt: 'ASC' } // Ensures the chat reads top-to-bottom correctly
   });


  }
  async findUserThreads(userId: number) {
    // This query gets the most recent message from each unique threadId for a user 
    const rawThreads = await this.msgRepo.createQueryBuilder('message')
    .distinctOn(['message.threadId'])
    .addSelect('message.humanMessage', 'title')
    .addSelect('message.createdAt', 'createdAt')
    .where('message.userId = :userId', { userId })
    .andWhere('message.status != :status', {status: 'error'})
    .orderBy('message.threadId')
    .addOrderBy('message.createdAt', 'DESC') // Get the most recent message title
    .getRawMany();
    return rawThreads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } 
}  