import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService = new ConfigService(),
  ) {}
  uploadedImageUrl: string;

  s3 = new S3({
    region: this.configService.get('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
    },
  });

  async processImage(productId: number, image_url: string) {
    const originalImageLocation = join(__dirname, 'temp', `${v4()}.jpg`);

    const newFileLocation = join(__dirname, 'temp', `${v4()}-compressed.jpg`);

    try {
      const { data } = await axios.get(image_url, {
        responseType: 'arraybuffer',
      });

      await new Promise<void>((resolve) => {
        fs.writeFile(
          originalImageLocation,
          data,
          (err: NodeJS.ErrnoException) => {
            if (err) {
              console.log(
                'erro ao criar imagem com retorno do AXIOS: ',
                err.message,
              );
            }

            resolve();
          },
        );
      });

      await new Promise<void>((resolve): void => {
        sharp(fs.readFileSync(originalImageLocation))
          .jpeg({ quality: 80 })
          .toFile(newFileLocation, (err: Error) => {
            if (err) {
              console.log('erro no SHARP: ', err.message);
              return { productId, error: true };
            }

            resolve();
          });
      });

      const { Location } = await this.s3
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: `${v4()}.jpg`,
          Body: fs.readFileSync(newFileLocation),
        })
        .promise();

      this.uploadedImageUrl = Location;

      fs.unlinkSync(originalImageLocation);
      fs.unlinkSync(newFileLocation);
    } catch (error) {
      return { productId, error: true };
    }

    return { productId, image_url: this.uploadedImageUrl, error: false };
  }
}
