import { CommonOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';
import { RestaurantDetail } from './google-restaurant.interface';

export class RestaurantDetailInput {
  @IsString()
  restaurantId: string;
}

export class RestaurantDetailOutput extends CommonOutput {
  restaurantDetail?: RestaurantDetail;
}
