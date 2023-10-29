import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { v4 } from 'uuid';

const s3 = new S3({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIAR5JYWJKXGNXDMXWA',
    secretAccessKey: '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',
  },
});

@Injectable()
export class AppService {
  uploadedImageUrl: string;

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

      const { Location } = await s3
        .upload({
          Bucket: 'ferreirasedorisbucket',
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
