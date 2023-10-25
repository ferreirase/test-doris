import { Module } from '@nestjs/common';
import { productProviders } from '@providers/product.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...productProviders],
})
export class ProductModule {}
