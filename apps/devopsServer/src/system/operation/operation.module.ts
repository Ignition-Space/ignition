import { Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import { operationProviders } from './operation.providers';

import { DatabaseModule } from '@app/common';

@Module({
  controllers: [OperationController],
  providers: [...operationProviders, OperationService],
  imports: [DatabaseModule],
  exports: [OperationService],
})
export class OperationModule { }
