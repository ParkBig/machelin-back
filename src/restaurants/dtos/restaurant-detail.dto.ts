import { CommonOutput } from 'src/common/dtos/output.dto';
import { GooglePlace } from 'src/google-api/dtos/google-place-dto';

export class RestaurantDetailInput {
  restaurantId: string;
}

export class RestaurantDetailOutput extends CommonOutput {
  restaurantDetail?: GooglePlace;
  machelinRating?: number;
  machelinTotal?: number;
}
