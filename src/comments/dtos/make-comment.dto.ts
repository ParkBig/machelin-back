import { CommonOutput } from 'src/common/dtos/output.dto';

export class MakeCommentInput {
  postId: number;
  comment: string;
}

export class MakeCommentOutput extends CommonOutput {}
