import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ThirdMiniProgramTaskDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  thirdMiniProgramId: number;

  @ApiProperty({ example: 'name' })
  @IsNotEmpty()
  thirdMiniProgramName: string;

  @ApiProperty({ example: 'name' })
  @IsNotEmpty()
  taskId: number;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  status?: number;

  @ApiProperty({ example: 'string' })
  imgPath?: string;

  @ApiProperty({ example: 'string' })
  extJson?: string;

  @ApiProperty({ example: 'string' })
  tplId?: string;

  @ApiProperty({ example: 'string' })
  qrCodeUrl?: string;

  @ApiProperty({ example: 'string' })
  templateId?: string;

  @ApiProperty({ example: 'string' })
  currentVersion?: string;
}

export class ThirdMiniProgramTaskListDto {
  @ApiProperty({ type: [ThirdMiniProgramTaskDto], example: [] })
  tasks: ThirdMiniProgramTaskDto[];
  @ApiProperty({ example: '1111234' })
  projectId: number;

  @ApiProperty({ example: '1' })
  environment: number;
}

export class ThirdMiniProgramTaskSearchDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 1 })
  projectId?: number;

  @ApiProperty({ example: 1 })
  thirdMiniProgramId?: number;

  @ApiProperty({ example: 'name' })
  thirdMiniProgramName?: string;

  @ApiProperty({ example: 'name' })
  createTime?: string;

  @ApiProperty({ example: 'name' })
  taskId?: number;

  @ApiProperty({ example: 0 })
  status?: number;

  @ApiProperty({ example: 'string' })
  imgPath?: string;
}
