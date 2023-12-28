import { ThirdMiniProgramTask } from './third-mini-program-task.entity';

export const thirdMiniProgramTaskProviders = [
  {
    provide: 'THIRD_MINI_PROGRAM_TASK_REPOSITORY',
    useFactory: (AppDataSource) =>
      AppDataSource.getRepository(ThirdMiniProgramTask),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
