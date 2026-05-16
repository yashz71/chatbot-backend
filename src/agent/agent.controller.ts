import { Controller, Post, Body, Sse, MessageEvent, Res } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AgentService } from './agent.service';
import express from 'express'; // Import from express
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  // @Sse('chat')
  // sse(@Body() body: { message: string, userId: string }): Observable<MessageEvent> {
  //   console.log("message: ",body.message, " userID: ", body.userId);
  //   return this.agentService.getStream(body.userId, body.message).pipe(
  //     map((axiosResponse) => {
  //       // We take the raw stream from Python and pass it to Angular
  //       return { data: axiosResponse.data }; 
  //     }),
  //   );
  // } 
  
}
