import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';
import { Follower } from '../entities/follower.entity';

export class UsersFollowersInput {}

export class UsersFollowersOutput extends CommonOutput {
  followers?: Follower[];
}
