import { IsOptional } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { GooglePlace } from './google-place-dto';

export class NearbySearchInput {
  lat: string;

  lng: string;

  radius: string;

  keyword: string;

  @IsOptional()
  nextPageParams: string;
}

export class NearbySearchOutput extends CommonOutput {
  restaurants?: GooglePlace[];
  next_page_token?: string;
}
