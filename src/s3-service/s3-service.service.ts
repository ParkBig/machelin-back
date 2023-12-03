import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3ServiceService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get('AWS_BUCKET_NAME');
  }

  async uploadImage(image: Express.Multer.File): Promise<string> {
    const { originalname, buffer, mimetype } = image;

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: originalname,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const uploadCommand = new PutObjectCommand(uploadParams);
      await this.s3Client.send(uploadCommand);

      const publicUrl = `https://${this.bucketName}.s3.${this.configService.get(
        'AWS_REGION',
      )}.amazonaws.com/${originalname}`;

      return publicUrl;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }

  async uploadImages(images: Array<Express.Multer.File>): Promise<string[]> {
    const uploadPromises: Promise<string>[] = images.map(async (image) => {
      const { originalname, buffer, mimetype } = image;
      const uploadParams: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: originalname,
        Body: buffer,
        ContentType: mimetype,
      };

      try {
        const uploadCommand = new PutObjectCommand(uploadParams);
        await this.s3Client.send(uploadCommand);

        const imageUrl = `https://${
          this.bucketName
        }.s3.${this.configService.get(
          'AWS_REGION',
        )}.amazonaws.com/${originalname}`;

        return imageUrl;
      } catch (error) {
        throw new Error('Failed to upload image');
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }
}
