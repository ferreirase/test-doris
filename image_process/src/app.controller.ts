import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

export interface IProductCreated {
  products: Array<{ id: number; image_url: string }>;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('product_created')
  async getMessages(@Payload() { products }: IProductCreated) {
    console.log(
      await this.appService.processImage(products[0].id, products[0].image_url),
    );
  }
}
