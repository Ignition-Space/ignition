import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class addMaterialConfigDto {
  @ApiProperty({ example: '11' })
  @IsNotEmpty()
  materialId: string;

  @ApiProperty({ example: '11' })
  @IsNotEmpty()
  version: string;

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
