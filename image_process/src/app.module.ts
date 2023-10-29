import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const configService: ConfigService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'IMAGE_PROCESS_PROXY',
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
