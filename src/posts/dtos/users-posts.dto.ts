import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';
import { IsOptional } from 'class-validator';

export class UsersPostsInput {
  targetId: number;

  @IsOptional()
  myId: number;

  page: number;
}

export class UsersPostsOutput extends CommonOutput {
  posts?: Post[];

  nextPage?: number | null;
}
