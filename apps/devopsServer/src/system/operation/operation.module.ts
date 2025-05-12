import { Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

import { DatabaseModule } from '@app/common';
import { Operation } from './operation.mongo.entity';

@Module({
  controllers: [OperationController],
  providers: [
    {
      provide: 'OPERATION_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Operation),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    OperationService,
  ],
  imports: [DatabaseModule],
  exports: [OperationService],
})
export class OperationModule { }
