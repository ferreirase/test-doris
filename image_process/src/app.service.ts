import { HttpException, Injectable } from '@nestjs/common';
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

    const { data } = await axios.get(image_url, {
      responseType: 'arraybuffer',
    });

    try {
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(
          originalImageLocation,
          data,
          (err: NodeJS.ErrnoException) => {
            if (err) {
              reject(
                new HttpException(
                  'Error when trying to download the image',
                  400,
                ),
              );
            } else {
              console.log('Image downloaded successfully!');
              resolve();
            }
          },
        );
      });

      await new Promise<void>((resolve, reject) => {
        sharp(fs.readFileSync(originalImageLocation))
          .jpeg({ quality: 80 })
          .toFile(newFileLocation, (err: Error) => {
            if (err) {
              console.error(err);
              reject(
                new HttpException(
                  'Error when trying to compress the image',
                  400,
                ),
              );
            } else {
              console.log('Image compressed successfully');
              resolve();
            }
          });
      });

      const uploadedImage = await s3
        .upload({
          Bucket: 'ferreirasedorisbucket',
          Key: `${v4()}.jpg`,
          Body: fs.readFileSync(newFileLocation),
        })
        .promise();

      this.uploadedImageUrl = uploadedImage.Location;

      fs.unlinkSync(originalImageLocation);
      fs.unlinkSync(newFileLocation);

      console.log('URL da imagem carregada:', this.uploadedImageUrl);
    } catch (error) {
      console.error(error);
    }

    return { id: productId, image_url: this.uploadedImageUrl };
  }
}
