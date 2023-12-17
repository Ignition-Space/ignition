import { CreateProjectDto } from '@materialsServer/material/physical/physical.dto';
import { MATERIAL_TYPE } from '@materialsServer/material/physical/physical.mongo.entity';
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

export class addMonorepoGroupDto extends CreateProjectDto {
  @ApiProperty({ example: '营销组件库' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '业务线' })
  bizTitle: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  bizId: number;

  @ApiProperty({ example: [MATERIAL_TYPE.npm], enum: MATERIAL_TYPE })
  @IsNotEmpty()
  type: MATERIAL_TYPE[];

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  desc: string;
}

export class getGroupDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string;
}
