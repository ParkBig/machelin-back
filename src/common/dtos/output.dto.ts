import { IsBoolean, IsString } from 'class-validator';

export class CommonOutput {
  @IsBoolean()
  ok?: boolean;

  @IsString()
  msg?: string;

  @IsString()
  error?: string;
}
