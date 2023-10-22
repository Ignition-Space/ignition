import { ApiProperty } from '@nestjs/swagger';

export class AddProjectDto {
  @ApiProperty({ example: '6263f15f6d160033b35061d7', description: '项目id' })
  id?: string;

  @ApiProperty({ example: '测试项目', description: '中文名' })
  zhName: string;

  @ApiProperty({ example: 'test', description: '英文名' })
  enName: string;

  @ApiProperty({ example: '测试', description: '项目描述' })
  desc: string;

  @ApiProperty({ example: 'cdn', description: '项目类型' })
  projectTypes: string[];

  // git project fields

  @ApiProperty({ example: '1', description: 'git 仓库 id' })
  gitProjectId: number;

  @ApiProperty({ example: '1', description: 'git 仓库 group name' })
  gitNamespace: string;

  @ApiProperty({ example: '1', description: 'git 仓库 地址' })
  gitProjectUrl: string;

  @ApiProperty({ example: '1', description: 'git 仓库项目名称' })
  gitProjectName: string;

  @ApiProperty({ example: '1', description: 'git 仓库项目描述' })
  gitProjectDesc: string;
}
