import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductController from '@product/product.controller';
import ProductService from '@product/product.service';
import Product from './entities/product.entity';

const configService: ConfigService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE_PROXY',
        transport: Transport.RMQ,
        options: {
          urls: [`${configService.get<string>('RMQ_HOST')}`],
          queue: `${configService.get<string>('RMQ_QUEUE')}`,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
