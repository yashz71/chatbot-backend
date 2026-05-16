import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsGateway } from './charts.gateway';
import { DatabaseChartsModule } from 'src/database-charts/database-charts.module';
import { ChartsController } from './charts.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseChartsModule,AuthModule],
  providers: [ChartsGateway, ChartsService],
  controllers: [ChartsController],
})
export class ChartsModule {}
