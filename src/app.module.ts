import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import {ThrottlerModule} from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './agent/agent.module';
import { MessageModule } from './message/message.module';
import { ChartsModule } from './charts/charts.module';
import { DatabaseChartsModule } from './database-charts/database-charts.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // No need to import ConfigModule elsewhere
      envFilePath: '.env', // Path to your environment file
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    AgentModule,
    MessageModule,
    ChartsModule,
    DatabaseChartsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
