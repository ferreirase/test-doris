import CreateProductDto from '@dtos/product/create.dto';
import Product from '@entities/product.entity';
import { HttpException, Inject, Injectable } from '@nestjs/common';
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
