import { config } from '@db/orm.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => config,
      inject: [ConfigService],
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
