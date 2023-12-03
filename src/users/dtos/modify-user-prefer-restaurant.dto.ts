import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ModifyUserPreferRestaurantInput {
  @IsString()
  changePreferRestaurant: string;
}

export class ModifyUserPreferRestaurantOutput extends CommonOutput {}
