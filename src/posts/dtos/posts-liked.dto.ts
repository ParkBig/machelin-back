import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class PostsLikedInput {
  page: number;
}

export class PostsLikedOutput extends CommonOutput {
  postsLiked?: Post[];
  nextPage?: number | null;
}
