import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { TaskModule } from '../task/task.module';
import { CodeGroupService } from './code/code.service';
import { GroupController } from './group.controller';
import { GroupProviders } from './group.providers';
import { MonorepoGroupService } from './monorepo/monorepoGroup.service';
import { MultrepoGroupService } from './multrepo/multrepoGroup.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => TaskModule)],
  controllers: [GroupController],
  providers: [
    MultrepoGroupService,
    MonorepoGroupService,
    CodeGroupService,
    ...GroupProviders,
  ],
  exports: [MultrepoGroupService, MonorepoGroupService, CodeGroupService],
})
export class GroupModule { }
