import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { CustomerModule } from './modules/customer/customer.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    DatabaseModule,
    AiModule,
    HealthModule,
    CustomerModule,
    BookingModule,
  ],
})
export class AppModule {}
