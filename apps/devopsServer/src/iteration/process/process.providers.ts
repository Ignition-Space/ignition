import { Process } from './process.entity';
import { ProcessNode } from './processNode/processNode.entity';
import { ProcessFlow } from './processFlow/processFlow.entity';

export const processProviders = [
  {
    provide: 'PROCESS_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Process),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
  {
    provide: 'PROCESS_NODE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(ProcessNode),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
  {
    provide: 'PROCESS_FLOW_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(ProcessFlow),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
