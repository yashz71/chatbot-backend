import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export const Database = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: configService.get<string>('POSTGRESQL_STRING'), 
        ssl: true, 
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        // Using join makes the path more reliable
        entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],

        // Recommendation: set to false once your first table is created
        synchronize: false, 
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];