import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class CheckVerificationInput {
  @IsString()
  phoneNumber: string;

  @IsString()
  verificationCode: string;
}

export class CheckVerificationOutput extends CommonOutput {}
