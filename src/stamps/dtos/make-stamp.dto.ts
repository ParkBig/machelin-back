import { IsNumber, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class MakeStampInput {
  @IsString()
  restaurantId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  restaurantName: string;

  @IsString()
  address: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  totalRatings: number;
}

export class MakeStampOutput extends CommonOutput {}
