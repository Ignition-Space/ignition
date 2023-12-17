import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';

export class SearchHistoryDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ default: '1', enum: ProcessNodes })
  @IsNotEmpty()
  environment: ProcessNodes;
}

export class SearchListDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ default: '1', enum: ProcessNodes })
  @IsNotEmpty()
  environment: ProcessNodes;

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;
}

export class SaveProductDto {
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  taskId: number;

  @ApiProperty({ default: 'http://xxx.html' })
  htmlAdr: string;
}
