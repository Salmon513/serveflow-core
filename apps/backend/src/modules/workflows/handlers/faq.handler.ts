import { Injectable } from '@nestjs/common';
import type { FaqResponse, WorkflowResult } from '@serveflow/shared';
import { AiService } from '../../ai/ai.service';
import type { WorkflowInput } from '../workflow.types';

@Injectable()
export class FaqHandler {
  constructor(private readonly aiService: AiService) {}

  async handle(input: WorkflowInput): Promise<WorkflowResult> {
    const result = await this.aiService.answerFaq({
      question: input.message,
      restaurantContext: input.restaurantContext,
      menuContext: input.menuContext,
    });

    const data: FaqResponse = {
      answer: result.data.answer,
      confidence: result.data.confidence,
    };

    return {
      type: 'faq',
      success: result.success,
      data,
    };
  }
}
