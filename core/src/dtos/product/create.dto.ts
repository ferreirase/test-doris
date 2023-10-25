import { ProductCategory } from '@entities/product.entity';

export default interface CreateProductDto {
  identifier: string;
  name: string;
  image_url: string;
  list_price: number;
  selling_price: number;
  category: ProductCategory;
}
