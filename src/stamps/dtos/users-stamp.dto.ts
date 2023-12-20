import { CommonOutput } from 'src/common/dtos/output.dto';
import { Stamp } from '../entities/stamp.entity';

export class UsersStampInput {}

export class UsersStampOutput extends CommonOutput {
  stamps?: Stamp[];
}
