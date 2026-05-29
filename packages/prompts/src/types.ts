export interface PromptDefinition {
  name: string;
  systemRole: string;
  instructions: string[];
  expectedJsonStructure: string[];
  constraints: string[];
}

export function formatPromptDefinition(prompt: PromptDefinition): string {
  return [
    `Role: ${prompt.systemRole}`,
    '',
    'Instructions:',
    ...prompt.instructions.map((line) => `- ${line}`),
    '',
    'Expected JSON Structure:',
    ...prompt.expectedJsonStructure.map((line) => `- ${line}`),
    '',
    'Constraints:',
    ...prompt.constraints.map((line) => `- ${line}`),
  ].join('\n');
}
