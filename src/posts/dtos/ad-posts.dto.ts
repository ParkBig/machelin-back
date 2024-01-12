import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class AdPostsInput {
  page: number;
}

export class AdPostsOutput extends CommonOutput {
  adPosts?: Post[];
  nextPage?: number | null;
}
