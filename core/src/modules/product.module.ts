import ProductController from '@controllers/product.controller';
import { Module } from '@nestjs/common';
import { productProviders } from '@providers/product.providers';
import ProductService from '@services/product/product.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...productProviders, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
