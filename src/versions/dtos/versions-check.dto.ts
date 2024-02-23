import { CommonOutput } from 'src/common/dtos/output.dto';

export class VersionsCheckInput {}

export class VersionsCheckOutput extends CommonOutput {
  machelinCurrentVersion?: string;
}
