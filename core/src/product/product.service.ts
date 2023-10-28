import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import CreateProductDto from '@product/dtos/create.dto';
import Product from '@product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class ProductService {
  constructor(
    @Inject('PROCESS_IMAGE_SERVICE')
    private readonly processImageServiceQueue: ClientProxy,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    this.processImageServiceQueue.connect();
  }

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

    const newProduct = await this.productRepository.save(
      Product.create({ ...body }),
    );

    this.processImageServiceQueue.send('product-created', {
      id: newProduct.id,
      image_url: body.image_url,
    });

    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
