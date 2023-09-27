import { IsNumber } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entitu';

export class UserProfileInput {
  @IsNumber()
  userId: number;
}

export class UserProfileOutput extends CommonOutput {
  user?: User;
}
