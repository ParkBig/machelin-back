import { IsArray, IsNumber, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ToggleBookmarkInput {
  @IsString()
  restaurantId: string;

  @IsString()
  lat: string;

  @IsString()
  lng: string;

  @IsString()
  restaurantName: string;

  @IsArray()
  images: string[];

  @IsString()
  address: string;

  @IsString()
  rating: string;

  @IsString()
  totalRatings: string;
}

export class ToggleBookmarkOutput extends CommonOutput {}
