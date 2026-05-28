import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { Customer, CreateCustomerRequest } from '@serveflow/shared';
import { DATABASE_POOL } from '../../database/database.provider';

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: Date;
}

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

@Injectable()
export class CustomerRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<Customer | null> {
    const result: QueryResult<CustomerRow> = await this.pool.query(
      'SELECT id, name, phone, email, created_at FROM customers WHERE id = $1',
      [id],
    );
    return result.rows[0] ? rowToCustomer(result.rows[0]) : null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const result: QueryResult<CustomerRow> = await this.pool.query(
      'SELECT id, name, phone, email, created_at FROM customers WHERE phone = $1',
      [phone],
    );
    return result.rows[0] ? rowToCustomer(result.rows[0]) : null;
  }

  async create(data: CreateCustomerRequest): Promise<Customer> {
    const result: QueryResult<CustomerRow> = await this.pool.query(
      `INSERT INTO customers (name, phone, email)
       VALUES ($1, $2, $3)
       RETURNING id, name, phone, email, created_at`,
      [data.name, data.phone, data.email ?? null],
    );
    return rowToCustomer(result.rows[0]);
  }
}
