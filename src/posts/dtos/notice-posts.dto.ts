import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class NoticePostsInput {
  page: number;
}

export class NoticePostsOutput extends CommonOutput {
  noticePosts?: Post[];
  nextPage?: number | null;
}
