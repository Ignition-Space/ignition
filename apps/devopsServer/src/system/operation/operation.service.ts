import { Injectable, Inject } from '@nestjs/common';
import { getOperatorByTime } from '@devopsServer/utils/operators';
import { Repository, Raw, In } from 'typeorm';
import { ListOperationDto } from './operation.dto';
import { Operation } from './operation.entity';

@Injectable()
export class OperationService {
  constructor(
    @Inject('OPERATION_REPOSITORY')
    private operationRepository: Repository<Operation>,
  ) { }

  createOrUpdate(operation: Operation): Promise<Operation> {
    return this.operationRepository.save(operation);
  }

  list(dto: ListOperationDto) {
    return this.operationRepository.find({
      where: {
        operationTime: getOperatorByTime(dto.startTime, dto.endTime),
        operationType:
          Array.isArray(dto.operationTypes) && dto.operationTypes.length > 0
            ? In(dto.operationTypes)
            : Raw(() => '1=1'),
      },
      take: 20,
    });
  }
}
