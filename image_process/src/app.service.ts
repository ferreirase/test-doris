import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  async processImage(productId: number, image_url: string) {
    const originalImageLocation = join(__dirname, 'temp', `${v4()}.jpg`);

    const newFileLocation = join(__dirname, 'temp', `${v4()}-compressed.jpg`);

    const { data } = await axios.get(image_url, {
      responseType: 'arraybuffer',
    });

    fs.writeFile(originalImageLocation, data, (err: NodeJS.ErrnoException) => {
      if (err) throw new HttpException('Error when trying download image', 400);
      console.log('Image downloaded successfully!');

      sharp(fs.readFileSync(originalImageLocation))
        .jpeg({ quality: 80 })
        .toFile(newFileLocation, (err: Error) => {
          if (err) {
            console.error(err);
            throw new HttpException('Error when trying compress image', 400);
          }
          console.log('Imagem comprimida com sucesso.');
          fs.unlinkSync(originalImageLocation);
        });
    });

    return { id: productId, image_url: newFileLocation };
  }
}
