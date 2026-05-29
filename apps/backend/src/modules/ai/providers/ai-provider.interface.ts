export interface AiProvider {
  generateJson<T>(prompt: string, schemaName: string): Promise<T>;
}
