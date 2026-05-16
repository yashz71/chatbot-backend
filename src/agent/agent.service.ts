import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class AgentService {
    constructor(private readonly httpService: HttpService) {}
     sendChatWithFile(formData: FormData): Observable<string> {
      return new Observable((observer) => {
        let fullResponse = ''; // Local accumulator for chunks
        this.httpService.axiosRef.post('http://127.0.0.1:8000/chat',
        formData,
        {
          responseType: 'stream', 
          timeout: 600000,
          headers: {
            ...formData.getHeaders(),
          },
        }).then(response => {
          response.data.on('data', (chunk: Buffer) => {
            // Convert binary chunk to string and append to our accumulator
            const text = chunk.toString('utf8');
            fullResponse += text;
          });
  
          response.data.on('end', () => {  
            // Only emit once the stream is completely finished
            observer.next(fullResponse);
            observer.complete();
          });
  
          response.data.on('error', (err) => {
            observer.error(err);
          });
        }).catch(err => observer.error(err));
      });
    
    }
  
    getAgentResponse(formData: FormData ): Observable<string> {
        return new Observable((observer) => {
          let fullResponse = ''; // Local accumulator for chunks
    
          this.httpService.axiosRef.post(
            'http://127.0.0.1:8000/chat', // Use 127.0.0.1 for local communication
            formData,
            { 
              responseType: 'stream', 
              timeout: 600000, 
              headers: {
                ...formData.getHeaders(),
              }
            }
          ).then(response => {
            response.data.on('data', (chunk: Buffer) => {
              // Convert binary chunk to string and append to our accumulator
              const text = chunk.toString('utf8');
              fullResponse += text;
            });
    
            response.data.on('end', () => {  
              // Only emit once the stream is completely finished
              observer.next(fullResponse);
              observer.complete();
            });
    
            response.data.on('error', (err) => {
              observer.error(err);
            });
          }).catch(err => observer.error(err));
        });
}
}