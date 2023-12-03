import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class SendFindMyIdVerificationInput {
  @IsString()
  phoneNumber: string;
}

export class SendFindMyIdVerificationOutput extends CommonOutput {
  @IsString()
  email?: string;
}
