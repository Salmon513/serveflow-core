import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BookingRepository } from './booking.repository';

@Module({
  imports: [DatabaseModule],
  providers: [BookingRepository],
  exports: [BookingRepository],
})
export class BookingModule {}
