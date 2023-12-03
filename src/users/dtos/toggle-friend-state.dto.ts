import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class ToggleFriendStateInput {
  exploreUserId: number;
}

export class ToggleFriendStateOutput extends CommonOutput {}
