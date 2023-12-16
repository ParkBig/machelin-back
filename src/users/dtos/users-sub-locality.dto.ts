import { CommonOutput } from 'src/common/dtos/output.dto';

export class UsersSubLocalityInput {
  lat: string;
  lng: string;
}

export class UsersSubLocalityOutput extends CommonOutput {
  subLocality?: string;
}
