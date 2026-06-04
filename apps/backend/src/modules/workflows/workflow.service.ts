import { Injectable } from '@nestjs/common';
import type { WorkflowResult } from '@serveflow/shared';
import { BookingHandler } from './handlers/booking.handler';
import { FaqHandler } from './handlers/faq.handler';
import { HumanHandoffHandler } from './handlers/human-handoff.handler';
import { WorkflowRouter } from './workflow.router';
import type { WorkflowInput } from './workflow.types';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly router: WorkflowRouter,
    private readonly faqHandler: FaqHandler,
    private readonly bookingHandler: BookingHandler,
    private readonly handoffHandler: HumanHandoffHandler,
  ) {}

  async execute(input: WorkflowInput): Promise<WorkflowResult> {
    const workflowType = this.router.route(input.message);

    switch (workflowType) {
      case 'faq':
        return this.faqHandler.handle(input);
      case 'booking':
        return this.bookingHandler.handle(input);
      case 'human_handoff':
        return this.handoffHandler.handle(input);
    }
  }
}
