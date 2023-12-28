import { DeployHistory } from '../history/history.entity';

export const historyProviders = [
  {
    provide: 'DEPLOY_HISTORY_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(DeployHistory),
    inject: ['DATABASE_CONNECTION'],
  },
];
