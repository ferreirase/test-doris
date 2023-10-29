import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: Number(process.env.DATABASE_PORT),
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_DB_DEFAULT}`,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  autoLoadEntities: true,
  synchronize: false,
  logging: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(
  config as unknown as DataSourceOptions,
);
