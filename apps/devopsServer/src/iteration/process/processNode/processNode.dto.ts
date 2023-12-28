import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IterationStatus } from '@devopsServer/iteration/iteration.entity';
import { Task } from '@devopsServer/deploy/task/task.entity';
import { ProcessNodes } from '../process.entity';

export class CreatProcessNodeDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'dev' })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ enum: ProcessNodes })
  @IsNotEmpty()
  env: ProcessNodes;

  @ApiProperty({ example: '开发环境' })
  @IsNotEmpty()
  desc: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  key: number;
}
