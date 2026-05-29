import { Body, Controller, Post } from '@nestjs/common';
import type {
  ApiResponse,
  BookingIntentResponse,
  FaqResponse,
} from '@serveflow/shared';
import { AiService } from './ai.service';
import {
  BookingIntentRequestDto,
  FaqRequestDto,
} from './dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('faq')
  answerFaq(@Body() body: FaqRequestDto): Promise<ApiResponse<FaqResponse>> {
    return this.aiService.answerFaq(body);
  }

  @Post('booking-intent')
  extractBookingIntent(
    @Body() body: BookingIntentRequestDto,
  ): Promise<ApiResponse<BookingIntentResponse>> {
    return this.aiService.extractBookingIntent(body);
  }
}
