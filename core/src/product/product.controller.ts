import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import CreateProductDto from '@product/dtos/create.dto';
import Product from '@product/entities/product.entity';
import ProductService from '@product/product.service';

interface IBodyCreateProduct {
  products: CreateProductDto[];
}

@Controller()
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

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

    return { products: productsCreated };
  }
}
