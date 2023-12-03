import { CommonOutput } from 'src/common/dtos/output.dto';
import { Dislike } from 'src/posts/entities/dislike.entity';
import { Like } from 'src/posts/entities/like.entity';
import { Post } from 'src/posts/entities/post.entity';

export class UsersPostsInput {}

export class UsersPostsOutput extends CommonOutput {
  posts?: Post[];
  likes?: Like[];
  dislikes?: Dislike[];
}
