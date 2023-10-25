import { connectionSource } from '@db/orm.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => connectionSource.initialize(),
  },
];
