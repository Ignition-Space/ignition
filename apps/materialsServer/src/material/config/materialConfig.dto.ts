import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProcessNodes } from '../physical/physical.dto';

export class addMaterialConfigDto {
  @ApiProperty({ example: '11' })
  @IsNotEmpty()
  materialId: string;

  @ApiProperty({ example: '11' })
  @IsNotEmpty()
  version: string;

  @ApiProperty({ example: '11', enum: ProcessNodes })
  @IsNotEmpty()
  env: ProcessNodes;

  @ApiProperty({ example: 'ss' })
  contain?: string;

  @ApiProperty({ example: 'ss' })
  cdn?: string;
}

export class searchMaterialConfigDto {
  @ApiProperty({ example: '11' })
  @IsNotEmpty()
  materialId: string;
}
