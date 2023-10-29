import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

export interface IProductCreated {
  products: Array<{ id: number; image_url: string }>;
}

@Controller()
export class AppController {
  constructor(
    @Inject('IMAGE_PROCESS_PROXY')
    private readonly imageProcessProxy: ClientProxy,
    private readonly appService: AppService,
  ) {
    this.imageProcessProxy.connect();
  }

  @EventPattern('product_created')
  async getMessages(@Payload() { products }: IProductCreated) {
    return this.imageProcessProxy.emit(
      'image_processed',
      await Promise.all(
        products.map(
          async (product) =>
            await this.appService.processImage(product.id, product.image_url),
        ),
      ),
    );
  }
}
