import { ApiProperty } from '@nestjs/swagger';

export class ThirdMiniProgramConfigDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: 1 })
  environment: number;

  @ApiProperty({ example: 'http://baidu.com' })
  interface?: string;

  @ApiProperty({ example: 'http://baidu.com' })
  secretToken?: string;

  config?: string;
}
