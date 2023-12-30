import { CommonOutput } from 'src/common/dtos/output.dto';

export class ModifyPostPublicStateInput {
  id: number;

  isPublic: boolean;
}

export class ModifyPostPublicStateOutput extends CommonOutput {}
