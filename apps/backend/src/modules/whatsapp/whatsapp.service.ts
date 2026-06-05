import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { WorkflowResult } from '@serveflow/shared';
import { CustomerRepository } from '../customer/customer.repository';
import { WorkflowService } from '../workflows/workflow.service';
import type { WhatsAppWebhookPayload } from './whatsapp.types';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
    private readonly workflowService: WorkflowService,
  ) {}

  async handleInbound(payload: WhatsAppWebhookPayload): Promise<void> {
    const value = payload.entry?.[0]?.changes?.[0]?.value;
    const messages = value?.messages;

    if (!messages?.length) return;

    const message = messages[0];
    if (message.type !== 'text' || !message.text?.body) return;

    const phone = message.from;
    const messageText = message.text.body;
    const displayName = value?.contacts?.[0]?.profile?.name;

    try {
      let customer = await this.customerRepository.findByPhone(phone);

      if (!customer) {
        customer = await this.customerRepository.create({
          name: displayName ?? phone,
          phone,
        });
        this.logger.log(`New customer created: ${customer.id} (${phone})`);
      }

      const result = await this.workflowService.execute({
        message: messageText,
        customerId: customer.id,
      });

      const responseText = this.mapResultToText(result);
      await this.sendMessage(phone, responseText);
    } catch (error) {
      this.logger.error(
        `Failed to process inbound message from ${phone}`,
        error instanceof Error ? error.stack : String(error),
      );

      await this.sendMessage(
        phone,
        'Sorry, something went wrong. Please try again.',
      ).catch(() => {
        // ignore — already in error path
      });
    }
  }

  private mapResultToText(result: WorkflowResult): string {
    if (!result.success) {
      return 'Sorry, something went wrong. Please try again.';
    }

    const data = result.data as Record<string, unknown>;

    switch (result.type) {
      case 'faq': {
        return typeof data['answer'] === 'string'
          ? data['answer']
          : 'Sorry, something went wrong. Please try again.';
      }

      case 'booking': {
        const booking = data['booking'] as Record<string, unknown> | undefined;
        if (booking) {
          return `Your booking is confirmed for ${booking['requestedAt']}, party of ${booking['partySize']}.`;
        }
        return "Got it! Could you confirm your name so I can complete the booking?";
      }

      case 'human_handoff':
        return 'Let me connect you with our team. Someone will be with you shortly.';
    }
  }

  private async sendMessage(to: string, body: string): Promise<void> {
    const token = this.configService.get<string>('WHATSAPP_TOKEN');
    const phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body },
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      this.logger.error(
        `WhatsApp send failed [${response.status}]: ${responseText}`,
      );
    }
  }
}
