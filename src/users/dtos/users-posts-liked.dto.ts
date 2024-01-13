import { CommonOutput } from 'src/common/dtos/output.dto';

export class UsersPostsLikedInput {
  userId: number;
}

export class UsersPostsLikedOutput extends CommonOutput {
  postsLikedIdArr?: number[];
}
