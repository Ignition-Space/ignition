import { ThirdMiniProgramConfig } from './third-mini-program-config.entity';

export const thirdMiniProgramConfigProviders = [
  {
    provide: 'THIRD_MINI_PROGRAM_CONFIG_REPOSITORY',
    useFactory: (AppDataSource) =>
      AppDataSource.getRepository(ThirdMiniProgramConfig),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
