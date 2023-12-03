import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class MakePostInput {
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @IsOptional()
  @IsString()
  restaurantName?: string;

  @IsOptional()
  @IsString()
  restaurantAddress?: string;

  @IsOptional()
  hashtags?: string;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsString()
  contents: string;

  @IsString()
  isPublic: string;
}

export class MakePostOutput extends CommonOutput {}
