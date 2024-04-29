import { CommonOutput } from 'src/common/dtos/output.dto';
import { UserPostBlock } from '../entities/userPostBlock.entity';

export class MyBlockedPostsInput {}

export class MyBlockedPostsOutput extends CommonOutput {
  myBlockedPosts?: UserPostBlock[];
}
