import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import * as sharp from 'sharp';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService = new ConfigService(),
  ) {}
  uploadedImageUrl: string;

  private readonly logger = new Logger(AppService.name);

  s3 = new S3({
    region: this.configService.get('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
    },
  });

  async processImage(productId: number, image_url: string) {
    try {
      const { data } = await axios.get(image_url, {
        responseType: 'arraybuffer',
      });

      const { Location } = await this.s3
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: `${v4()}.jpg`,
          Body: sharp(data).jpeg({ quality: 80 }).toBuffer(),
        })
        .promise();

      this.uploadedImageUrl = Location;
    } catch (error) {
      this.logger.log(`AppService catch error: ${error.message}`);
      return { productId, error: true };
    }

    return { productId, image_url: this.uploadedImageUrl, error: false };
  }
}
