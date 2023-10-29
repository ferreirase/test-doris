import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import CreateProductDto from '@product/dtos/create.dto';
import Product from '@product/entities/product.entity';
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
}
