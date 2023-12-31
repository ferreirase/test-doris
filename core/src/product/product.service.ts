import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateProductDto from '@product/dtos/create.dto';
import Product from '@product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class ProductService {
  constructor(
    @InjectRepository(Product)
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

    const newProduct = await this.productRepository.save(
      Product.create({ ...body }),
    );

    newProduct.image_url = body.image_url;

    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findById(productId: number): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
  }

  async saveProduct(product: Product) {
    return this.productRepository.save(product);
  }
}
