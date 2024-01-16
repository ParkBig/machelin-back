import { IsEmail, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class SignUpInput {
  @IsString()
  loginId: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;
}

export class SignUpOutput extends CommonOutput {}
