import { CommonOutput } from 'src/common/dtos/output.dto';

export class ToggleUserPostBlockInput {
  postId: number;
}

export class ToggleUserPostBlockOutput extends CommonOutput {}
