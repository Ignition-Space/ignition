import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class addGroupDto {
  @ApiProperty({ example: '营销组件库' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '业务线' })
  bizTitle: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  bizId: number;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  desc: string;
}

export class addMonorepoGroupDto {
  @ApiProperty({ example: '营销组件库' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '业务线' })
  bizTitle: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  bizId: number;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  desc: string;
}

export class searchGroupDto {
  @ApiProperty({ example: '1' })
  bizId?: number;
}

export class getGroupDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string;
}
