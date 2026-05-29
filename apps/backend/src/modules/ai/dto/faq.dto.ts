import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class FaqRequestDto {
  @IsString()
  @MaxLength(1_500)
  question!: string;

  @IsOptional()
  @IsString()
  @MaxLength(3_000)
  restaurantContext?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3_000)
  menuContext?: string;
}

export class FaqResponseDto {
  @IsString()
  @MaxLength(1_500)
  answer!: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  confidence!: number;
}
