import { IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { GooglePlace } from './google-place-dto';

export class TextSearchInput {
  @IsString()
  keyword: string;

  @IsString()
  isRestaurant: string;

  @IsOptional()
  radius: string;

  @IsOptional()
  nextPageParams: string;
}

export class TextSearchOutput extends CommonOutput {
  restaurants?: GooglePlace[];
  next_page_token?: string;
}
