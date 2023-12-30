import { IsOptional } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { GooglePlace } from './google-place-dto';

export class TextSearchInput {
  keyword: string;

  isRegional: boolean;

  @IsOptional()
  nextPageParams: string;
}

export class TextSearchOutput extends CommonOutput {
  restaurants?: GooglePlace[];
  next_page_token?: string;
}
