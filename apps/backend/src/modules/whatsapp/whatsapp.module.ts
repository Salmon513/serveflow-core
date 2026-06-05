import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { WorkflowModule } from '../workflows/workflow.module';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [CustomerModule, WorkflowModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
