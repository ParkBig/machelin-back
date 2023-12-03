import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class CheckFindMyIdkVerificationInput {
  @IsString()
  phoneNumber: string;

  @IsString()
  verificationCode: string;
}

export class CheckFindMyIdVerificationOutput extends CommonOutput {
  @IsString()
  token?: string;
}
