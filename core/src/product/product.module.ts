import { DatabaseModule } from '@db/database.module';
import { Module } from '@nestjs/common';
import ProductController from '@product/product.controller';
import ProductService from '@product/product.service';
import { productProviders } from '@product/providers/product.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...productProviders, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
