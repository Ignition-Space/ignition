import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IterationStatus } from '@devopsServer/iteration/iteration.entity';
import { Task } from '@devopsServer/deploy/task/task.entity';
import { Process } from './process.entity';

export class ListDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: [IterationStatus.doing], enum: [IterationStatus] })
  status?: IterationStatus[];

  @ApiProperty({ example: 1 })
  fplanId?: number;
}

export class ListResponseDto extends Process {
  devCurrentTask: Task;

  testCurrentTask: Task;

  fixCurrentTask: Task;

  prodCurrentTask: Task;
}
