import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [DatabaseModule],
  providers: [CustomerRepository],
  exports: [CustomerRepository],
})
export class CustomerModule {}
