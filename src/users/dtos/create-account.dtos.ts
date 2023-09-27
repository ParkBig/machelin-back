import { IsEmail, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class CreateAccountInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  nickName: string;
}

export class CreateAccountOutput extends CommonOutput {}
