import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DEVICE_TYPE, PAGE_TYPE } from './page.mongo.entity';

export class addPageDto {
  @ApiProperty({ example: '/home' })
  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  @ApiProperty({ example: '631a94d2593f1aa2a85d5de7' })
  siteId: string;

  @IsNotEmpty()
  @ApiProperty({ example: '631a9ed2fc0ca4a4616c76fe' })
  interfaceId: string;

  @ApiProperty({ example: 'website' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '61efc1c078b2d45cb889df8a' })
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ example: PAGE_TYPE.csr, enum: PAGE_TYPE })
  @IsNotEmpty()
  type: PAGE_TYPE;

  @ApiProperty({ example: DEVICE_TYPE.pc, enum: DEVICE_TYPE })
  @IsNotEmpty()
  device: DEVICE_TYPE;
}

export class updatePageDto extends addPageDto {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  id: string;
}

export class findPageDto {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  id: string;
}

export class PageRestoreDto {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  snapshotId: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  pageId: string;
}
export class searchPageDto {
  @ApiProperty({ example: '61efcb879070245f2b7036b6' })
  @IsNotEmpty()
  siteId: string;
}

export enum ENV_OUT_NODES {
  'offline' = 0,
  'online' = 1,
}
