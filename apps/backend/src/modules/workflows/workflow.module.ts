import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { BookingModule } from '../booking/booking.module';
import { BookingHandler } from './handlers/booking.handler';
import { FaqHandler } from './handlers/faq.handler';
import { HumanHandoffHandler } from './handlers/human-handoff.handler';
import { WorkflowRouter } from './workflow.router';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [AiModule, BookingModule],
  providers: [WorkflowService, WorkflowRouter, FaqHandler, BookingHandler, HumanHandoffHandler],
  exports: [WorkflowService],
})
export class WorkflowModule {}
