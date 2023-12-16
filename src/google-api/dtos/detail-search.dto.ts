import { CommonOutput } from 'src/common/dtos/output.dto';
import { GooglePlace } from './google-place-dto';

export class DetailSearchInput {
  restaurantId: string;
}

export class DetailSearchOutput extends CommonOutput {
  restaurantDetail?: GooglePlace;
}
