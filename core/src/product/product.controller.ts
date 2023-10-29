import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import CreateProductDto from '@product/dtos/create.dto';
import Product, {
  ProcessProductStatus,
} from '@product/entities/product.entity';
import ProductService from '@product/product.service';

interface IBodyCreateProduct {
  products: CreateProductDto[];
}

@Controller()
export default class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE_PROXY')
    private readonly productServiceProxy: ClientProxy,
    private readonly productService: ProductService,
  ) {
    this.productServiceProxy.connect();
  }

  @Get('/products')
  async findAll(): Promise<{ products: Product[] | [] }> {
    return { products: await this.productService.findAll() };
  }

  @Post('/products')
  async create(
    @Body() { products }: IBodyCreateProduct,
  ): Promise<{ products: Product[] | HttpException }> {
    const productsCreated = [];

    await Promise.all(
      products.map(async (productDto: CreateProductDto) =>
        productsCreated.push(await this.productService.create(productDto)),
      ),
    );

    this.productServiceProxy.emit('product_created', {
      products: productsCreated.map((product: Product) => {
        return { id: product.id, image_url: product.image_url };
      }),
    });

    return { products: productsCreated };
  }

  @EventPattern('image_processed')
  async getProcessedImages(
    @Payload()
    images: Array<{ productId: number; image_url: string; error: boolean }>,
  ) {
    images.length &&
      images.forEach(async (processedImage) => {
        const productFound = await this.productService.findById(
          processedImage.productId,
        );

        productFound && processedImage.error && processedImage.error === true
          ? (productFound.changeStatus(ProcessProductStatus.PROCESSED_ERROR),
            await this.productService.saveProduct(productFound))
          : (productFound.changeStatus(ProcessProductStatus.PROCESSED),
            productFound.activeProduct(),
            (productFound.image_url = processedImage.image_url),
            await this.productService.saveProduct(productFound));
      });
  }
}
