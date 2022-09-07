import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { API_TYPE, PAGE_TYPE } from './site.mongo.entity';

export class AddSiteDto {
  @ApiProperty({ example: '63183f3635609a2d4965ccaa' })
  id?: string;

  @ApiProperty({ example: 'http://localhost:3004/api/doc-json' })
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: API_TYPE.swagger, enum: API_TYPE })
  @IsNotEmpty()
  apiType: string;

  @ApiProperty({ example: '搭建服务' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: PAGE_TYPE.pc, enum: PAGE_TYPE })
  @IsNotEmpty()
  type: PAGE_TYPE;
}

export class GenerateSiteDto {
  @ApiProperty({ example: '63183f3635609a2d4965ccaa' })
  @IsNotEmpty()
  id: string;
}
