import { Injectable, Inject } from '@nestjs/common';
import { getOperatorByTime } from '@devopsServer/utils/operators';
import { MongoRepository } from 'typeorm';
import { ListOperationDto } from './operation.dto';
import { Operation } from './operation.mongo.entity';

@Injectable()
export class OperationService {
  constructor(
    @Inject('OPERATION_REPOSITORY')
    private operationRepository: MongoRepository<Operation>,
  ) { }

  createOrUpdate(operation: Operation): Promise<Operation> {
    return this.operationRepository.save(operation);
  }

  list(dto: ListOperationDto) {
    const conditions: any = {};

    if (dto.startTime || dto.endTime) {
      conditions.operationTime = {};
      if (dto.startTime) {
        conditions.operationTime.$gte = new Date(dto.startTime);
      }
      if (dto.endTime) {
        conditions.operationTime.$lte = new Date(dto.endTime);
      }
    }

    if (Array.isArray(dto.operationTypes) && dto.operationTypes.length > 0) {
      conditions.operationType = { $in: dto.operationTypes };
    }

    return this.operationRepository.find({
      where: conditions,
      take: 20,
    });
  }
}
