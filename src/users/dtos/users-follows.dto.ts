import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class UsersFollowsInput {}

export class UsersFollowsOutput extends CommonOutput {
  follows?: User[];
}
