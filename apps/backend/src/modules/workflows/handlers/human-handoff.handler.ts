import { Injectable } from '@nestjs/common';
import type { WorkflowResult } from '@serveflow/shared';
import type { WorkflowInput } from '../workflow.types';

export interface HandoffWorkflowData {
  handoffRequired: true;
}

@Injectable()
export class HumanHandoffHandler {
  handle(_input: WorkflowInput): WorkflowResult {
    const data: HandoffWorkflowData = { handoffRequired: true };
    return { type: 'human_handoff', success: true, data };
  }
}
