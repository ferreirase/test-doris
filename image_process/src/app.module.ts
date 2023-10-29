import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const rabbitmqPort = 5672;
const rabbitmqHost = '127.0.0.1';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IMAGE_PROCESS_PROXY',
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
