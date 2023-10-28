import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductController from '@product/product.controller';
import ProductService from '@product/product.service';
import Product from './entities/product.entity';

const rabbitmqPort = 5672;
const rabbitmqHost = '127.0.0.1';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ClientsModule.register([
      {
        name: 'PROCESS_IMAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${rabbitmqHost}:${rabbitmqPort}`],
          queue: 'myqueue',
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
