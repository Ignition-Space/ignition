import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/common';;
import { TaskModule } from '../task/task.module';
import { MaterialConfigService } from './config/materialConfig.service';
import { MaterialProviders } from './material.providers';
import { PhysicalMaterialService } from './physical/physical.service';
import { VirtualMaterialService } from './virtual/virtual.service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => TaskModule),
  ],
  controllers: [],
  providers: [...MaterialProviders, PhysicalMaterialService, VirtualMaterialService, MaterialConfigService],
  exports: [PhysicalMaterialService, VirtualMaterialService, MaterialConfigService]
})

export class MaterialModule { }
