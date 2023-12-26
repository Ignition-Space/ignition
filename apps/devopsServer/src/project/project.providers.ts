import { UserStaredProject } from './user-star-project.entity';

export const projectProviders = [
  {
    provide: 'USER_STAR_PROJECT_REPOSITORY',
    useFactory: (connection) => connection.getRepository(UserStaredProject),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
