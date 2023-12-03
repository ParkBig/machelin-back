import { IsNumber, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ReportPostInput {
  @IsNumber()
  postId: number;

  @IsString()
  report: string;
}

export class ReportPostOutput extends CommonOutput {}
