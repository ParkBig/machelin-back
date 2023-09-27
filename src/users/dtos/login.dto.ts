import { IsEmail, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginOutput extends CommonOutput {
  @IsString()
  token?: string;
}
