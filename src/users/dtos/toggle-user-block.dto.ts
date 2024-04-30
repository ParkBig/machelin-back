import { CommonOutput } from 'src/common/dtos/output.dto';

export class ToggleUserBlockInput {
  userId: number;
}

export class ToggleUserBlockOutput extends CommonOutput {}
