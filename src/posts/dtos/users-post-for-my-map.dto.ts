import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class UsersPostForMyMapInput {
  userId: number;
}

export class UsersPostForMyMapOutput extends CommonOutput {
  posts?: Post[];
}
