import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiProvider } from './ai-provider.interface';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
}

@Injectable()
export class GeminiProvider implements AiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    this.model = this.configService.get<string>(
      'GEMINI_MODEL',
      DEFAULT_GEMINI_MODEL,
    );
  }

  async generateJson<T>(prompt: string, schemaName: string): Promise<T> {
    const response = await this.request(prompt, schemaName);
    const text = this.extractText(response, schemaName);
    const jsonPayload = this.extractJsonPayload(text);

    if (!jsonPayload) {
      throw new BadGatewayException(
        `${schemaName}: provider returned an empty JSON payload.`,
      );
    }

    try {
      return JSON.parse(jsonPayload) as T;
    } catch (error) {
      this.logger.error(
        `${schemaName}: provider returned non-JSON content.`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException(
        `${schemaName}: provider returned invalid JSON.`,
      );
    }
  }

  private async request(
    prompt: string,
    schemaName: string,
  ): Promise<GeminiGenerateContentResponse> {
    const endpoint = `${GEMINI_API_BASE_URL}/${this.model}:generateContent`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });
    } catch (error) {
      this.logger.error(
        `${schemaName}: Gemini request failed.`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new ServiceUnavailableException(
        'AI service is temporarily unavailable.',
      );
    }

    let payload: GeminiGenerateContentResponse;
    try {
      payload = (await response.json()) as GeminiGenerateContentResponse;
    } catch (error) {
      this.logger.error(
        `${schemaName}: Gemini response was not valid JSON.`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException(
        `${schemaName}: provider response could not be parsed.`,
      );
    }

    if (!response.ok) {
      this.logger.error(
        `${schemaName}: Gemini returned HTTP ${response.status}.`,
      );
      throw new ServiceUnavailableException(
        payload.error?.message ?? 'AI service is temporarily unavailable.',
      );
    }

    return payload;
  }

  private extractText(
    response: GeminiGenerateContentResponse,
    schemaName: string,
  ): string {
    if (response.promptFeedback?.blockReason) {
      throw new BadGatewayException(
        `${schemaName}: provider blocked the prompt.`,
      );
    }

    const text = response.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      throw new BadGatewayException(
        `${schemaName}: provider returned no text content.`,
      );
    }

    return text;
  }

  private extractJsonPayload(payload: string): string | null {
    const trimmed = payload.trim();
    if (trimmed.length === 0) {
      return null;
    }

    const fencedMatch = trimmed.match(/```(?:json|JSON)?\s*([\s\S]*?)\s*```/);
    if (fencedMatch) {
      return fencedMatch[1]?.trim() ?? null;
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return trimmed.slice(firstBrace, lastBrace + 1).trim();
    }

    return trimmed;
  }
}
