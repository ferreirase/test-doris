import { connectionSource } from '@db/orm.config';

export const databaseProviders = [
  {
    provide: 'DATABASE',
    useFactory: async () => connectionSource.initialize(),
  },
];
