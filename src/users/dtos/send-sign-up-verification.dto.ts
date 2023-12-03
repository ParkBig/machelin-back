import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class SendSignUpVerificationInput {
  @IsString()
  phoneNumber: string;
}

export class SendSignUpVerificationOutput extends CommonOutput {}
