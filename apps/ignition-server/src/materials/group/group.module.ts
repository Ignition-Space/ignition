import { Module } from '@nestjs/common';
import { CodeGroupService } from './code/code.service';
import { GroupController } from './group.controller';
import { CodeGroup } from './code/code.mongo.entity';

@Module({
  imports: [],
  controllers: [GroupController],
  providers: [
    CodeGroupService,
    {
      provide: 'CODE_GROUP_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(CodeGroup),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  exports: [CodeGroupService],
})
export class GroupModule {}
