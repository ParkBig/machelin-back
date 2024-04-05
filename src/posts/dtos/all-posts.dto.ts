import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class AllPostsInput {
  page: number;
}

export class AllPostsOutput extends CommonOutput {
  allPosts?: Post[];
  nextPage?: number | null;
}
