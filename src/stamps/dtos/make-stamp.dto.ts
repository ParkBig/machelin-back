import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class MakeStampInput {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  @IsOptional()
  restaurantId: string;

  @IsString()
  @IsOptional()
  restaurantName: string;

  @IsString()
  @IsOptional()
  address: string;
}

export class MakeStampOutput extends CommonOutput {}
