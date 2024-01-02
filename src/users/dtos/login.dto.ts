import { IsEmail, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class LoginInput {
  @IsString()
  loginId: string;

  @IsString()
  password: string;
}

export class LoginOutput extends CommonOutput {
  @IsString()
  token?: string;
}
