export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  customerId: string;
  restaurantId: string;
  partySize: number;
  requestedAt: string; // ISO 8601
  confirmedAt?: string;
  status: BookingStatus;
  notes?: string;
}

export interface CreateBookingRequest {
  customerId: string;
  restaurantId: string;
  partySize: number;
  requestedAt: string; // ISO 8601
  notes?: string;
}
