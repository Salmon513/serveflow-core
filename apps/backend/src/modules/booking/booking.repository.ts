import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { Booking, BookingStatus, CreateBookingRequest } from '@serveflow/shared';
import { DATABASE_POOL } from '../../database/database.provider';

interface BookingRow {
  id: string;
  customer_id: string;
  party_size: number;
  requested_at: Date;
  confirmed_at: Date | null;
  status: string;
  notes: string | null;
  created_at: Date;
}

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    customerId: row.customer_id,
    restaurantId: '', // populated in Phase 7+ when restaurants table is added
    partySize: row.party_size,
    requestedAt: row.requested_at.toISOString(),
    confirmedAt: row.confirmed_at?.toISOString(),
    status: row.status as BookingStatus,
    notes: row.notes ?? undefined,
  };
}

const BOOKING_COLUMNS = `
  id, customer_id, party_size,
  requested_at, confirmed_at,
  status, notes, created_at
`;

@Injectable()
export class BookingRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<Booking | null> {
    const result: QueryResult<BookingRow> = await this.pool.query(
      `SELECT ${BOOKING_COLUMNS} FROM bookings WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? rowToBooking(result.rows[0]) : null;
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    const result: QueryResult<BookingRow> = await this.pool.query(
      `SELECT ${BOOKING_COLUMNS} FROM bookings
       WHERE customer_id = $1
       ORDER BY requested_at DESC`,
      [customerId],
    );
    return result.rows.map(rowToBooking);
  }

  async create(data: CreateBookingRequest): Promise<Booking> {
    const result: QueryResult<BookingRow> = await this.pool.query(
      `INSERT INTO bookings (customer_id, party_size, requested_at, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING ${BOOKING_COLUMNS}`,
      [data.customerId, data.partySize, data.requestedAt, data.notes ?? null],
    );
    return rowToBooking(result.rows[0]);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const confirmedAt = status === 'confirmed' ? new Date().toISOString() : null;

    const result: QueryResult<BookingRow> = await this.pool.query(
      `UPDATE bookings
       SET status = $2,
           confirmed_at = CASE WHEN $2 = 'confirmed' THEN $3::TIMESTAMPTZ ELSE confirmed_at END
       WHERE id = $1
       RETURNING ${BOOKING_COLUMNS}`,
      [id, status, confirmedAt],
    );
    return result.rows[0] ? rowToBooking(result.rows[0]) : null;
  }
}
