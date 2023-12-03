import { CommonOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';
import { RestaurantDetail } from './google-restaurant.interface';
import { Post } from 'src/posts/entities/post.entity';

export class RestaurantDetailInput {
  @IsString()
  restaurantId: string;
}

export class RestaurantDetailOutput extends CommonOutput {
  restaurantDetail?: RestaurantDetail;
}
