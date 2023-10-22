import { CodeGroup } from "./code/code.mongo.entity";
import { MonorepoGroup } from "./monorepo/monorepoGroup.mongo.entity";
import { MultrepoGroup } from "./multrepo/multrepoGroup.mongo.entity";

export const GroupProviders = [
  {
    provide: 'MULTREPO_GROUP_REPOSITORY',
    useFactory: async (AppDataSource) => await AppDataSource.getRepository(MultrepoGroup),
    inject: ['MONGODB_DATA_SOURCE'],
  },
  {
    provide: 'MONOREPO_GROUP_REPOSITORY',
    useFactory: async (AppDataSource) => await AppDataSource.getRepository(MonorepoGroup),
    inject: ['MONGODB_DATA_SOURCE'],
  },
  {
    provide: 'CODE_GROUP_REPOSITORY',
    useFactory: async (AppDataSource) => await AppDataSource.getRepository(CodeGroup),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
