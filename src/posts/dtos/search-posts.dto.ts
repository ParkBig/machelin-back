import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class SearchPostsInput {
  keyword: string;
  page: number;
}

export class SearchPostsOutput extends CommonOutput {
  searchPosts?: Post[];
  nextPage?: number | null;
}
