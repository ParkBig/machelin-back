import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class NicknameInput {
  @IsString()
  nickname: string;
}

export class NicknameOutput extends CommonOutput {
  users?: User[];
}
