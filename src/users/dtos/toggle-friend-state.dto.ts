import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';
import { IsInstance } from 'class-validator';

export class ToggleFriendStateInput {
  userInfo: User;
}

export class ToggleFriendStateOutput extends CommonOutput {}
