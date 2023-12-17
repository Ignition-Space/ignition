import { ApiProperty } from '@nestjs/swagger';
import { OperationType } from './operation.entity';

export class ListOperationDto {
  @ApiProperty({ example: 1633414492000 })
  startTime?: number;

  @ApiProperty({ example: 1636092735868 })
  endTime?: number;

  @ApiProperty({ example: [], enum: OperationType })
  operationTypes?: OperationType[];
}
