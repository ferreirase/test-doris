import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Acesse o ConfigService diretamente

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`${configService.get<string>('RMQ_HOST')}`],
      queue: `${configService.get<string>('RMQ_QUEUE')}`,
      queueOptions: {
        durable: true,
      },
    },
  });

  (await app.startAllMicroservices()).listen(
    configService.get<string>('APP_PORT') || 3001,
    () => {
      console.log(
        `Server is listening on ${
          configService.get<string>('APP_PORT') || 3001
        }`,
      );
    },
  );
}
bootstrap();
