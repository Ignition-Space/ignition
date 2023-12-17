import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ThirdMiniProgramListDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: JSON.stringify({}) })
  environment?: number;
}

export class ThirdMiniProgramUpdateDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: JSON.stringify({}) })
  cusConfig: string;

  @ApiProperty({ example: '1111234' })
  projectId: number;

  @ApiProperty({ example: '1111234' })
  environment: number;
}

export class commitCodeDto {
  @ApiProperty({ example: [30] })
  thirdMiniProgramIds: number[];

  @ApiProperty({ example: '1111234' })
  componentAppId: string;

  @ApiProperty({ example: '1111234' })
  desc: string;

  @ApiProperty({ example: '1111234' })
  projectId: number;

  @ApiProperty({ example: '1111234' })
  environment: number;
}
