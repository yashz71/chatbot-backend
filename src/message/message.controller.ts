import { Controller, Post, Body, Req,Request, UseGuards, Get, Param, UploadedFile,
  UseInterceptors,
 } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';

import { FileInterceptor } from '@nestjs/platform-express';
@Controller('message')
export class MessageController {

    constructor(private readonly messageService: MessageService) {}
    @UseGuards(AuthGuard)
    @Post('send')
    @UseInterceptors(FileInterceptor('file'))
    async chat(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { text: string; threadId: string, userId: number  }
    ) {
      
        const userId = req.user.sub; // Extracting securely from the JWT token
      // We call the service that handles the 1. Save -> 2. Agent -> 3. Update flow
      return await this.messageService.handleUserMessage(
        userId, 
        body.threadId, 
        body.text,
        file
      );
    }
  @Post('upload-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body('threadId') threadId: string,
  ) {
    return this.messageService.uploadPdf(file, threadId);
  }
    @UseGuards(AuthGuard)
    @Get('thread/:threadId')
    async getHistory(@Param('threadId') threadId: string) {
      // You can add a method in MessageService to fetch all messages for this thread
      // This is what your Angular sidebar will call when a user clicks a past chat.
      return await this.messageService.findAllByThread(threadId);
    }
@UseGuards(AuthGuard)
@Get('user-threads')
async getThreads(@Req() req: any) {
  return await this.messageService.findUserThreads(req.user.sub);
}
}
