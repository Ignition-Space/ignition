import { ApiProperty } from '@nestjs/swagger';

export class MergeRequestChangeDto {
  id: number;
  merge_request_iid: number;
  access_raw_diffs?: boolean;
}

export class GetProjectDto {
  @ApiProperty({ example: 685 })
  id: number;
  file_path?: string;
}

export class MRSearchConditionDto {
  @ApiProperty({ example: 685 })
  id?: number;
  state?: 'opened' | 'all';
  milestone?: string;
  labels?: string;
  author_id?: string;
  author_username?: string;
  my_reaction_emoji?: string;
  scope?: string;
  search?: string;
}

export class MergeRequestDto {
  @ApiProperty({ example: '新的MR' })
  title?: string;

  @ApiProperty({ example: '685' })
  id?: number;

  @ApiProperty({ example: 'feat/1.0.0' })
  source_branch?: string;

  @ApiProperty({ example: 'feat/1.0.1' })
  target_branch?: string;

  @ApiProperty({ example: '1' })
  merge_request_iid?: string | number;
}

export class GitProjectDto {
  @ApiProperty({ example: 'projectname' })
  name: string;

  @ApiProperty({ example: 'mypath' })
  path: string;

  @ApiProperty({ example: '679' })
  namespace_id?: string;

  @ApiProperty({ example: '我是 git 项目描述' })
  description?: string;
}

export class GetGitAllProjectListDto {
  simple?: boolean;
  starred?: boolean;
  @ApiProperty({ example: 'hello' })
  search?: string;
}

export class GetUserProjectListDto {
  @ApiProperty({ example: true })
  starred?: boolean;
}

export class BranchDto {
  @ApiProperty({ example: 'master' })
  ref?: string;

  @ApiProperty({ example: 685 })
  projectId: number;

  @ApiProperty({ example: 'feat/1.0.0' })
  branch: string;
}

export class UserDto {
  @ApiProperty({ example: '' })
  username: string;
  @ApiProperty({ example: '' })
  password: string;
}

export class AutoMergeDto extends MergeRequestDto {
  tag_name?: string;
  tag_message?: string;
  withTag?: boolean; // 是否需要打标签
}

export class CloseMergeDto {
  id: number;
  merge_request_iid: string;
}

export type Page = {
  per_page: number;
  page: number;
};

export class NamespaceDto { }

export class IGitCommitsDto {
  @ApiProperty({ example: 'test' })
  ref_name?: string;

  @ApiProperty({ example: '581' })
  projectId: number;

  @ApiProperty({ example: false })
  first_parent?: boolean;

  @ApiProperty({ example: '003c0cc8' })
  sha?: string;

  @ApiProperty({ example: '0da90a89' })
  from?: string;

  @ApiProperty({ example: '003c0cc8' })
  to?: string;
}
