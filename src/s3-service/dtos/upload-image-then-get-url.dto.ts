import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

export class UploadImageThenGetUrlInput {
  @IsString()
  imageName: string;

  imageBuffer: Buffer;
}

export class UploadImageThenGetUrlOutput extends CommonOutput {
  imageUrls?: string[];
}
