import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class UsersPostsInput {}

export class UsersPostsOutput extends CommonOutput {
  posts?: Post[];
}
