import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class ModifyUserActivityZoneInput {
  @IsString()
  changeActivityZone: string;
}

export class ModifyUserActivityZoneOutput extends CommonOutput {}
