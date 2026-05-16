import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Stock } from 'src/charts/entities/stocks-chart.entity';
import { Currency } from 'src/charts/entities/currencies-chart.entity';
import { Commodity } from 'src/charts/entities/commodity-chart.entity';
import { Bond } from 'src/charts/entities/bonds-chart.entity';
import { DimAsset } from 'src/charts/entities/dim-asset.entity';
import { FactMarketHistory } from 'src/charts/entities/fact-market-history.entity';

export const DatabaseCharts = [
  {
    provide: 'DATA_SOURCE_CHARTS',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: configService.get<string>('POSTGRESQL_STRING_CHARTS'), 
        ssl: true, 
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        // Using join makes the path more reliable
        entities: [DimAsset, FactMarketHistory],
      

        // Recommendation: set to false once your first table is created
        synchronize: false, 
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];