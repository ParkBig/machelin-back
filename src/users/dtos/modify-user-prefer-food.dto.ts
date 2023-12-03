import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ModifyUserPreferFoodInput {
  @IsString()
  type: 'add' | 'delete';

  @IsString()
  changePreferFood: string;
}

export class ModifyUserPreferFoodOutput extends CommonOutput {}
