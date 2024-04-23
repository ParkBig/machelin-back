import { CommonOutput } from 'src/common/dtos/output.dto';
import { IsOptional, IsString } from 'class-validator';
import { GooglePlace } from 'src/google-api/dtos/google-place-dto';

export class RestaurantsTextSearchInput {
  @IsString()
  keyword: string;

  @IsString()
  isRestaurant: string;

  @IsOptional()
  @IsString()
  radius: string;

  @IsOptional()
  nextPageParams: string;
}

export class RestaurantsTextSearchOutput extends CommonOutput {
  restaurants?: GooglePlace[];
  next_page_token?: string;
}
