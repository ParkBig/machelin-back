import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class MeInput {}

export class MeOutput extends CommonOutput {
  authUser?: User;
}
