import CreateProductDto from '@dtos/product/create.dto';
import Product from '@entities/product.entity';
import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import ProductService from '@services/product/product.service';

@Controller()
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/products')
  async findAll(): Promise<{ products: Product[] | [] }> {
    return { products: await this.productService.findAll() };
  }

  @Post('/products')
  async create(
    @Body() body: CreateProductDto,
  ): Promise<{ product: Product | HttpException }> {
    return { product: await this.productService.create(body) };
  }
}
