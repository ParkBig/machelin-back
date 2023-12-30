import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class MakeStampInput {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  lat: string;

  @IsNumber()
  lng: string;

  @IsOptional()
  restaurantId: string;

  @IsOptional()
  restaurantName: string;

  @IsOptional()
  address: string;
}

export class MakeStampOutput extends CommonOutput {}
