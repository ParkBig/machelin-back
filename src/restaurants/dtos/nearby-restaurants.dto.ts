import { IsString } from 'class-validator';
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
}

export class NearbyRestaurantsOutput extends CommonOutput {
  restaurants?: responseRestaurant[];
}
