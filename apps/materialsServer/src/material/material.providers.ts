import { MaterialConfig } from './config/materialConfig.mongo.entity';
import { PhysicalMaterial } from './physical/physical.mongo.entity';
import { VirtualMaterial } from './virtual/virtual.mongo.entity';

export const MaterialProviders = [
  {
    provide: 'PHYSICAL_MATERIAL_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(PhysicalMaterial),
    inject: ['MONGODB_DATA_SOURCE'],
  },
  {
    provide: 'VIRTUAL_MATERIAL_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(VirtualMaterial),
    inject: ['MONGODB_DATA_SOURCE'],
  },
  {
    provide: 'MATERIAL_CONFIG_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(MaterialConfig),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
