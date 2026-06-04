export type WorkflowType = 'faq' | 'booking' | 'human_handoff';

export interface WorkflowResult {
  type: WorkflowType;
  success: boolean;
  data: unknown;
}
