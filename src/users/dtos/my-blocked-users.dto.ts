import { CommonOutput } from 'src/common/dtos/output.dto';
import { UserBlock } from '../entities/userBlock.entity';

export class MyBlockedUsersInput {}

export class MyBlockedUsersOutput extends CommonOutput {
  myBlockedUsers?: UserBlock[];
}
