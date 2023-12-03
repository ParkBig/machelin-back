import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class ExploreUserInput {}

export class ExploreUserOutput extends CommonOutput {
  exploreUser?: User;
}
