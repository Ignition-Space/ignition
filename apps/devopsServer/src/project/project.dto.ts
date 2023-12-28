import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IterationStatus } from '@devopsServer/iteration/iteration.entity';
import { HasProject } from './project.validator';

import { Project } from './project.entity';

const deployJson = {
  cmd: {
    env: ['PUBLIC_URL', 'STATIC_EXTRA_PATH', 'DEPLOY_ENV'],
    script: 'npm run deploy',
  },
  products: [
    {
      type: 'html',
      path: './dist/main',
    },
    {
      type: 'static',
      path: './dist/static',
    },
    {
      type: 'nacos',
      path: './dist/main/index.html',
    },
  ],
  hooks: {
    pre: {
      env: [],
      script: 'npm run build:es',
    },
  },
};

export class CreateProjectDto {
  /**
   * @deprecated 应用中文名不在研发工作台中展示，默认会取 usName。请使用 usName 加备注的形式
   */
  @ApiProperty({ example: 'hello', title: '项目中文名' })
  zhName: string;

  @ApiProperty({
    example: 'hello',
    title: '项目唯一标识，作为部署项目的前缀路径名',
  })
  @IsNotEmpty()
  usName: string;

  @ApiProperty({ example: '我是项目描述' })
  desc: string;

  @ApiProperty({ example: ['weapp', 'web'] })
  @IsNotEmpty()
  projectTypes: string[];

  @ApiProperty({ example: 685 })
  gitProjectId: number;

  @ApiProperty({ example: 11, description: '绑定研发工作台项目id' })
  fprojectId: number;
}

type BaseInfo = {
  zhName: '';
  usName: '';
  projectTypes: string[];
  desc: '';
};

export class SetupDetailDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({
    example: {
      zhName: '我是改名后的项目名称',
      usName: 'Alisa',
      projectTypes: ['web', 'weapp'],
      desc: '你猜我猜不猜',
    },
  })
  baseInfo?: BaseInfo;
}
export class SetupDto extends SetupDetailDto {
  @ApiProperty({ example: 'iOs' })
  projectType?: string;
  @ApiProperty({
    example: JSON.stringify(deployJson),
  })
  deployConfig?: string;

  @ApiProperty({
    example: null,
  })
  secretToken?: string;

  @ApiProperty({
    example: null,
  })
  appId?: string;

  @ApiProperty({
    example: null,
  })
  publishDocker?: string;

  @ApiProperty({
    example: null,
  })
  builderDocker?: string;

  @ApiProperty({
    example: null,
  })
  componentAppId?: string;

  @ApiProperty({})
  onlineMicroConfig?: string;

  @ApiProperty({})
  offlineMicroConfig?: string;
}

export class CreateWithGitRepoDto {
  @ApiProperty({ example: 'hello' })
  @IsNotEmpty()
  zhName: string;

  // 作为部署项目的前缀路径名
  usName: string;

  // 即项目描述也是，gitlab 的项目描述
  @ApiProperty({ example: '我是项目描述' })
  desc: string;

  @ApiProperty({ example: ['weapp', 'web'] })
  @IsNotEmpty()
  projectTypes: string[];

  // git project fields

  @IsNotEmpty()
  @ApiProperty({ example: '123123' })
  gitNamespaceId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'demo' })
  gitProjectName: string;
}

export class BindGitRepoDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;
  @ApiProperty({ example: 685 })
  @IsNotEmpty()
  gitProjectId: number;
}

export class ProjectDetailDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id: number;
}

export class IRegisterMicroserviceDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id: number;
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2, 3] })
  MicrosIds: number[];
}

export class ProjectDetailByGitUrlDto {
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  gitUrl: string;
}

export class ProjectListWithPaginationDto {
  @ApiProperty({ example: 'hell' })
  keyword?: string;

  @ApiProperty({ example: ['web'] })
  projectTypes: string[];

  @ApiProperty({ example: [1, 2] })
  creatorIds?: string[];

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;
}

export class ListByStatusDto {
  @ApiProperty({ example: [IterationStatus.doing], enum: IterationStatus })
  status: IterationStatus[];

  take?: number;
}

export class StarProjectDto {
  @ApiProperty({ example: 1 })
  projectId: number;
}

export class IronAppDto {
  @ApiProperty({ example: 1 })
  jobId: number;
}

export class UnStarProjectDto {
  @ApiProperty({ example: 1 })
  projectId: number;
}

export class ProjectResponseDto extends Project {
  thirdConfig?: any;
  projectConfig?: any;
}
