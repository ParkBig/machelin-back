import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class SendVerificationInput {
  @IsString()
  phoneNumber: string;
}

export class SendVerificationOutput extends CommonOutput {}
