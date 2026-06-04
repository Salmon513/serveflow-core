import { Injectable, Logger } from '@nestjs/common';
import type { Booking, BookingIntentResponse, WorkflowResult } from '@serveflow/shared';
import { AiService } from '../../ai/ai.service';
import { BookingRepository } from '../../booking/booking.repository';
import type { WorkflowInput } from '../workflow.types';

export interface BookingWorkflowData {
  intent: BookingIntentResponse;
  booking?: Booking;
  pendingCustomerResolution: boolean;
}

@Injectable()
export class BookingHandler {
  private readonly logger = new Logger(BookingHandler.name);

  constructor(
    private readonly aiService: AiService,
    private readonly bookingRepository: BookingRepository,
  ) {}

  async handle(input: WorkflowInput): Promise<WorkflowResult> {
    const intentResult = await this.aiService.extractBookingIntent({
      message: input.message,
    });

    const intent = intentResult.data;

    const canPersist =
      input.customerId !== undefined &&
      intent.partySize !== null &&
      intent.partySize !== undefined &&
      intent.bookingDate !== null &&
      intent.bookingDate !== undefined;

    if (!canPersist) {
      const data: BookingWorkflowData = {
        intent,
        pendingCustomerResolution: input.customerId === undefined,
      };

      return { type: 'booking', success: true, data };
    }

    const booking = await this.bookingRepository.create({
      customerId: input.customerId as string,
      restaurantId: '',
      partySize: intent.partySize as number,
      requestedAt: intent.bookingDate as string,
      notes: intent.specialRequests ?? undefined,
    });

    this.logger.log(`Booking created: ${booking.id} for customer ${input.customerId}`);

    const data: BookingWorkflowData = {
      intent,
      booking,
      pendingCustomerResolution: false,
    };

    return { type: 'booking', success: true, data };
  }
}
