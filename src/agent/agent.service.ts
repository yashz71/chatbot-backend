import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

export interface AgentResponse {
  answer: string;
  thread_id: string;
  download_url?: string;
}

@Injectable()
export class AgentService {
  private readonly fastApiUrl: any | 'http://127.0.0.1:8000';
  constructor(private readonly httpService: HttpService, private configService: ConfigService) {
    this.fastApiUrl= this.configService.get<string>('FASTAPI_STRING')

  }
  
  sendChatWithFile(formData: FormData): Observable<AgentResponse> {
    return new Observable((observer) => {
      let fullResponse = '';

      this.httpService.axiosRef
        .post(`${this.fastApiUrl}/chat`, formData, {
          responseType: 'stream',
          timeout: 600000,
          headers: {
            ...formData.getHeaders(),
          },
        })
        .then((response) => {
          response.data.on('data', (chunk: Buffer) => {
            const text = chunk.toString('utf8');
            fullResponse += text;
          });

          response.data.on('end', () => {
            try {
              const parsed: AgentResponse = JSON.parse(fullResponse);

              observer.next(parsed);
              observer.complete();
            } catch (error) {
              observer.error(error);
            }
          });

          response.data.on('error', (err) => {
            observer.error(err);
          });
        })
        .catch((err) => observer.error(err));
    });
  }

  getAgentResponse(formData: FormData): Observable<AgentResponse> {
    return new Observable((observer) => {
      let fullResponse = '';

      this.httpService.axiosRef
        .post(`${this.fastApiUrl}/chat`, formData, {
          responseType: 'stream',
          timeout: 600000,
          headers: {
            ...formData.getHeaders(),
          },
        })
        .then((response) => {
          response.data.on('data', (chunk: Buffer) => {
            const text = chunk.toString('utf8');

            fullResponse += text;

            console.log('stream_chunk:', text);
          });

          response.data.on('end', () => {
            try {
              const parsed: AgentResponse = JSON.parse(fullResponse);

              console.log('parsed_response:', parsed);

              observer.next(parsed);
              observer.complete();
            } catch (error) {
              observer.error(error);
            }
          });

          response.data.on('error', (err) => {
            observer.error(err);
          });
        })
        .catch((err) => observer.error(err));
    });
  }
}