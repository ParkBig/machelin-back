import { CommonOutput } from 'src/common/dtos/output.dto';

export class UsersFollowsIdInput {
  userId: number;
}

export class UsersFollowsIdOutput extends CommonOutput {
  followsIdArr?: number[];
}
