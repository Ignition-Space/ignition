import { Resource } from './resource.mysql.entity';

export const ResourceProviders = [
  {
    provide: 'RESOURCE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Resource),
    inject: ['MYSQL_USER_DATA_SOURCE'],
  },
];
