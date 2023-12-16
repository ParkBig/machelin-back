import { IsArray, IsNumber, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ToggleBookmarkInput {
  @IsString()
  restaurantId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  restaurantName: string;

  @IsArray()
  images: string[];

  @IsString()
  address: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  totalRatings: number;
}

export class ToggleBookmarkOutput extends CommonOutput {}
