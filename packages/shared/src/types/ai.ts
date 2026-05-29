export interface FaqRequest {
  question: string;
  restaurantContext?: string;
  menuContext?: string;
}

export interface FaqResponse {
  answer: string;
  confidence: number;
}

export type BookingIntent = 'booking';

export interface BookingIntentRequest {
  message: string;
  referenceDate?: string;
  timezone?: string;
}

export interface BookingIntentResponse {
  intent: BookingIntent;
  customerName?: string | null;
  partySize?: number | null;
  bookingDate?: string | null;
  specialRequests?: string | null;
  confidence: number;
}
