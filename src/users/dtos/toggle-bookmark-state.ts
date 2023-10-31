import { IsNumber, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ToggleBookmarkStateInput {
  @IsString()
  id: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  restaurantName: string;

  @IsString()
  img: string;

  @IsString()
  address: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  totalUserRatings: number;
}

export class ToggleBookmarkStateOutput extends CommonOutput {}
