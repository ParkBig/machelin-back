import { IsNumber, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class TogglePostLikeDislikeInput {
  @IsNumber()
  postId: number;

  @IsString()
  which: 'like' | 'dislike';
}

export class TogglePostLikeDislikeOutput extends CommonOutput {}
