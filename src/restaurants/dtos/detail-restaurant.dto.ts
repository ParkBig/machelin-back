import { CommonOutput } from 'src/common/dtos/output.dto';
import { DetailRestaurant } from './google-restaurant.interface';
import { IsString } from 'class-validator';

export class DetailRestaurantInput {
  @IsString()
  placeId: string;
}

export class DetailRestaurantOutput extends CommonOutput {
  detailRestaurant?: DetailRestaurant;
}
