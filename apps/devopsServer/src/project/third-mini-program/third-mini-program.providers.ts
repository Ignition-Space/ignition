import { ThirdMiniProgram } from './third-mini-program.entity';

export const ThirdMiniProgramConfigProviders = [
  {
    provide: 'THIRD_MINI_PROGRAM_REPOSITORY',
    useFactory: (AppDataSource) =>
      AppDataSource.getRepository(ThirdMiniProgram),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
