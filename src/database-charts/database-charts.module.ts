import { Module } from '@nestjs/common';
import { DatabaseCharts } from './database-charts';

@Module({
  providers: [...DatabaseCharts],
  exports: [...DatabaseCharts],

})
export class DatabaseChartsModule {}
