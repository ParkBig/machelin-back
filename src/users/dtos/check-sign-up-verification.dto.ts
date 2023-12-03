import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class CheckSignUpVerificationInput {
  @IsString()
  phoneNumber: string;

  @IsString()
  verificationCode: string;
}

export class CheckSignUpVerificationOutput extends CommonOutput {}
