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
  hasRestaurantTag?: string;

  @IsOptional()
  restaurantLat: string;

  @IsOptional()
  restaurantLng: string;

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
  @IsString()
  rating?: string;

  @IsString()
  contents: string;

  @IsOptional()
  hashtags?: string;

  @IsString()
  isPublic: string;

  @IsString()
  ownerSubLocality: string;
}

export class MakePostOutput extends CommonOutput {}
