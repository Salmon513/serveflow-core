import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { WhatsAppWebhookPayload } from './whatsapp.types';
import { WhatsappService } from './whatsapp.service';

@Controller('webhooks/whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const expectedToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      return challenge;
    }

    throw new ForbiddenException();
  }

  @Post()
  @HttpCode(200)
  receive(@Body() payload: WhatsAppWebhookPayload): void {
    // Fire-and-forget — Meta requires HTTP 200 immediately.
    // All processing and error handling occurs inside WhatsappService.
    this.whatsappService.handleInbound(payload).catch((error: unknown) => {
      this.logger.error(
        'Unhandled error in WhatsApp inbound processing',
        error instanceof Error ? error.stack : String(error),
      );
    });
  }
}
