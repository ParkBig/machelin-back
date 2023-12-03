import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ModifyUserNicknameInput {
  @IsString()
  changeNickname: string;
}

export class ModifyUserNicknameOutput extends CommonOutput {}
