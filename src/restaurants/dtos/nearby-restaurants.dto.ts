import { IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { responseRestaurant } from './google-restaurant.interface';

export class NearbyRestaurantsInput {
  @IsString()
  lat: string;

  @IsString()
  lng: string;

  @IsString()
  radius: string;

  @IsString()
  keyword: string;

  @IsOptional()
  nextPageParams: string;
}

export class NearbyRestaurantsOutput extends CommonOutput {
  restaurants?: responseRestaurant[];
  next_page_token?: string;
}
