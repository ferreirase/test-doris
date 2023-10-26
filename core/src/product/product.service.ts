import { HttpException, Inject, Injectable } from '@nestjs/common';
import CreateProductDto from '@product/dtos/create.dto';
import Product from '@product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(body: CreateProductDto): Promise<Product | HttpException> {
    if (
      await this.productRepository.findOne({
        where: {
          identifier: body.identifier,
        },
      })
    ) {
      throw new HttpException('Product identifier already exists', 400);
    }

    return this.productRepository.save(Product.create({ ...body }));
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
