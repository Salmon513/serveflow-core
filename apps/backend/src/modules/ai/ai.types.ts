import type { PromptDefinition } from '@serveflow/prompts';
import type { ZodType } from 'zod';

export interface StructuredPromptRequest<TOutput> {
  prompt: PromptDefinition;
  schema: ZodType<TOutput>;
  schemaName: string;
  userInput: string;
}
