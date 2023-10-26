import CreateProductDto from '@dtos/product/create.dto';
import { HttpException } from '@nestjs/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ProcessProductStatus {
  PROCESSING = 'PROCESSING',
  PROCESSED_ERROR = 'PROCESSED_ERROR',
  PROCESSED = 'PROCESSED',
}

export enum ProductCategory {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

interface IProduct extends CreateProductDto {
  active: boolean;
}

@Entity()
export default class Product {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ unique: true })
  identifier: string;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  active: boolean = false;

  @Column({ nullable: true, type: 'text' })
  image_url: string | null = null;

  @Column()
  list_price: number;

  @Column()
  selling_price: number;

  @Column({ type: 'simple-enum' })
  status: ProcessProductStatus = ProcessProductStatus.PROCESSING;

  @Column({ type: 'simple-enum' })
  category: ProductCategory;

  @Column({ type: 'text', default: () => 'DATETIME()' })
  created_at: string;

  @Column({ type: 'text', default: () => 'DATETIME()' })
  updated_at: string;

  constructor(props: IProduct) {
    Object.assign(this, props);
  }

  static create(props: CreateProductDto) {
    return new Product({ ...props, image_url: null, active: false });
  }

  changeStatus(newStatus: ProcessProductStatus) {
    if (this.status === newStatus) {
      throw new HttpException(
        'Current product status and new product status are same',
        400,
      );
    }

    this.status = newStatus;
  }

  changeImageURL(newImageURL: string) {
    this.image_url = newImageURL;
  }
}
