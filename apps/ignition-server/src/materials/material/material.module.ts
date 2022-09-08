import { Module } from '@nestjs/common';
import { MaterialConfigService } from './config/materialConfig.service';
import { MaterialConfig } from './config/materialConfig.mongo.entity';
import { MaterialController } from './material.controller';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [GroupModule],
  controllers: [MaterialController],
  providers: [
    MaterialConfigService,
    {
      provide: 'MATERIAL_CONFIG_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(MaterialConfig),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  exports: [MaterialConfigService],
})
export class MaterialModule { }
