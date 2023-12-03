import { CommonOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

export class PostsCommentsInput {
  postId: number;
}

export class PostsCommentsOutput extends CommonOutput {
  comments?: Comment[];
}
