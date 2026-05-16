import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChartsGateway } from './charts.gateway';
import { ChartsService } from './charts.service';
@Controller('charts')
export class ChartsController {


  constructor(private readonly chartsGateway: ChartsGateway, private marketService: ChartsService) {}
 
  @UseGuards(AuthGuard)
  @Get('overview/:timeframe')
  async getOverview(@Param('timeframe') timeframe: string) {
    // Passes ?timeframe=1m from the URL to the service
    return this.marketService.getMarketOverview(timeframe || '1w');
  }

   @MessagePattern('web_gold') 
  async handleUpdate(@Payload() data: any) {
      data= await this.marketService.getMarketOverview('1w');
      console.log("test of the data:  ");
     this.chartsGateway.broadcastUpdate('web_gold', data);
    
     console.log(`[Real-time] Broadcasted update for: ${data.symbol || 'Market'}`);
  } 
}