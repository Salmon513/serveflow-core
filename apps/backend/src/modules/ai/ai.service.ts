import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  BOOKING_INTENT_PROMPT,
  FAQ_PROMPT,
  formatPromptDefinition,
} from '@serveflow/prompts';
import type { ApiResponse } from '@serveflow/shared';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { z } from 'zod';
import type { StructuredPromptRequest } from './ai.types';
import {
  BookingIntentRequestDto,
  BookingIntentResponseDto,
  FaqRequestDto,
  FaqResponseDto,
} from './dto';
import { AI_PROVIDER } from './providers/ai-provider.constants';
import type { AiProvider } from './providers/ai-provider.interface';

const faqResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1),
});

const bookingIntentResponseSchema = z.object({
  intent: z.literal('booking'),
  customerName: z.string().nullable(),
  partySize: z.number().int().positive().nullable(),
  bookingDate: z.string().nullable(),
  specialRequests: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject(AI_PROVIDER) private readonly aiProvider: AiProvider,
  ) {}

  async answerFaq(
    input: FaqRequestDto,
  ): Promise<ApiResponse<FaqResponseDto>> {
    const result = await this.runStructuredPrompt({
      prompt: FAQ_PROMPT,
      schema: faqResponseSchema,
      schemaName: 'serveflow_faq_response',
      userInput: [
        `Question:\n${input.question}`,
        input.restaurantContext
          ? `Restaurant Context:\n${input.restaurantContext}`
          : undefined,
        input.menuContext ? `Menu Context:\n${input.menuContext}` : undefined,
      ]
        .filter(Boolean)
        .join('\n\n'),
    });

    const dto = await this.validateDto(FaqResponseDto, result);
    return {
      success: true,
      data: dto,
    };
  }

  async extractBookingIntent(
    input: BookingIntentRequestDto,
  ): Promise<ApiResponse<BookingIntentResponseDto>> {
    const result = await this.runStructuredPrompt({
      prompt: BOOKING_INTENT_PROMPT,
      schema: bookingIntentResponseSchema,
      schemaName: 'serveflow_booking_intent_response',
      userInput: [
        `Customer Message:\n${input.message}`,
        input.referenceDate
          ? `Reference Date:\n${input.referenceDate}`
          : undefined,
        input.timezone ? `Timezone:\n${input.timezone}` : undefined,
      ]
        .filter(Boolean)
        .join('\n\n'),
    });

    const dto = await this.validateDto(BookingIntentResponseDto, result);
    return {
      success: true,
      data: dto,
    };
  }

  private async runStructuredPrompt<TOutput>({
    prompt,
    schema,
    schemaName,
    userInput,
  }: StructuredPromptRequest<TOutput>): Promise<TOutput> {
    const rawPayload = await this.aiProvider.generateJson<unknown>(
      this.composePrompt(prompt, userInput),
      schemaName,
    );

    const result = schema.safeParse(rawPayload);
    if (!result.success) {
      this.logger.error(
        `Structured AI output failed schema validation for ${schemaName}`,
        JSON.stringify(result.error.format()),
      );
      throw new BadGatewayException('AI returned an invalid structured payload.');
    }

    return result.data;
  }

  private composePrompt(
    prompt: StructuredPromptRequest<unknown>['prompt'],
    userInput: string,
  ): string {
    return [formatPromptDefinition(prompt), userInput].join('\n\n');
  }

  private async validateDto<T extends object>(
    ctor: new () => T,
    payload: unknown,
  ): Promise<T> {
    const dto = plainToInstance(ctor, payload);

    try {
      await validateOrReject(dto);
      return dto;
    } catch (error) {
      this.logger.error(
        `Structured AI output failed DTO validation for ${ctor.name}`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      throw new BadGatewayException('AI returned an invalid structured payload.');
    }
  }
}
