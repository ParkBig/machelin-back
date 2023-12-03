import { CommonOutput } from 'src/common/dtos/output.dto';
import { Like } from '../entities/like.entity';
import { Dislike } from '../entities/dislike.entity';

export class UsersPostLikesDislikesInput {}

export class UsersPostLikesDislikesOutput extends CommonOutput {
  usersLikes?: Like[];
  usersDislikes?: Dislike[];
}
