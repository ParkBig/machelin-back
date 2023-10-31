import { IsEmail, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class UserModifyInput {
  @IsString()
  type: 'nickName' | 'email' | 'pfp';

  @IsString()
  content: string;
}

export class UserModifyOutput extends CommonOutput {}
