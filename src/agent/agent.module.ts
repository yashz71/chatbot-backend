import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService]
})
export class AgentModule {}
