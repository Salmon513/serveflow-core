import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class BookingIntentRequestDto {
  @IsString()
  @MaxLength(2_000)
  message!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  referenceDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;
}

export enum BookingIntentKind {
  Booking = 'booking',
}

export class BookingIntentResponseDto {
  @IsEnum(BookingIntentKind)
  intent!: BookingIntentKind;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  customerName?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  partySize?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bookingDate?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialRequests?: string | null;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  confidence!: number;
}
