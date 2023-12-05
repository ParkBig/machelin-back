import { CommonOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';
import { RestaurantDetail } from './google-restaurant.interface';

export class RestaurantsTextSearchInput {
  @IsString()
  keyword: string;
}

export class RestaurantsTextSearchOutput extends CommonOutput {
  result?: RestaurantDetail[];
}
