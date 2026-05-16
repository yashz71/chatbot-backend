import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { AgentModule } from 'src/agent/agent.module';
import { MessageController } from './message.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AgentModule,DatabaseModule,HttpModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
