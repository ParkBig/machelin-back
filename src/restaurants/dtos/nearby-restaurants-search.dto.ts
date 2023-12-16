import { IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { GooglePlace } from 'src/google-api/dtos/google-place-dto';

export class NearbyRestaurantsSearchInput {
  @IsString()
  lat: string;

  @IsString()
  lng: string;

  @IsString()
  radius: string;

  @IsString()
  keyword: string;

  @IsOptional()
  nextPageParams: string;
}

export class NearbyRestaurantsSearchOutput extends CommonOutput {
  restaurants?: GooglePlace[];
  next_page_token?: string;
}
