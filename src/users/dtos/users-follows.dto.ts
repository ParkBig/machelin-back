import { CommonOutput } from 'src/common/dtos/output.dto';
import { Follow } from '../entities/follow.entity';

export class UsersFollowsInput {}

export class UsersFollowsOutput extends CommonOutput {
  follows?: Follow[];
}
