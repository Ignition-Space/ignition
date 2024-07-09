import { Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

import { DatabaseModule } from '@app/common';
import { Operation } from './operation.entity';

@Module({
  controllers: [OperationController],
  providers: [
    {
      provide: 'OPERATION_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(Operation),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    OperationService,
  ],
  imports: [DatabaseModule],
  exports: [OperationService],
})
export class OperationModule { }
