import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IterationStatus } from '@devopsServer/iteration/iteration.entity';

export class CreatProcessFlowDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'web' })
  name: string;

  @ApiProperty({ example: [1, 2, 3] })
  nodeIds: number[];
}
