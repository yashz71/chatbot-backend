import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChartsService } from './charts.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200',
  credentials: true,
 }, 
})
export class ChartsGateway {
  @WebSocketServer()
  server: Server;

  // This is a simple pass-through method
  broadcastUpdate(topic: string, data: any) {
    console.log("hop ra7aaa");
    this.server.emit(topic, data);
  }
}
