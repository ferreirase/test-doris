import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const rabbitmqPort = 5672;
  const rabbitmqHost = '127.0.0.1';

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitmqHost}:${rabbitmqPort}`],
      queue: 'myqueue',
      queueOptions: {
        durable: true,
      },
    },
  });

  (await app.startAllMicroservices()).listen(3000, () => {
    console.log('Server is listening on 3000');
  });
}
bootstrap();
