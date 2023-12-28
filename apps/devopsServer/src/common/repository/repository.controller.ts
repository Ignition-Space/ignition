import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { MessagePattern, Payload as MicroPayload } from '@nestjs/microservices';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  GitProjectDto,
  BranchDto,
  MergeRequestDto,
  MRSearchConditionDto,
  GetProjectDto,
  MergeRequestChangeDto,
  GetGitAllProjectListDto,
  IGitCommitsDto,
} from './repository.dto';
import { ApiTags } from '@nestjs/swagger';
import { PayloadUser, Public } from '@app/common';
import { CustomRpcExceptionFilter } from '@app/common/exceptions/rpc.exception.filter';

@ApiTags('仓库')
@Controller({
  path: 'repository',
})
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) { }

  @Post('/project/create')
  async createProject(
    @Body() projectDto: GitProjectDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.createProject(
      projectDto,
      user.gitAccessToken,
    );
  }

  @Post('/project/getProject')
  async getProject(
    @Body() getProjectDto: GetProjectDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getProject(
      getProjectDto,
      user.gitAccessToken,
    );
  }

  @Post('/project/list')
  async getAllProjectList(
    @Body() getGitAllProjectListDto: GetGitAllProjectListDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getAllProjectList(
      { simple: true, ...getGitAllProjectListDto },
      user.gitAccessToken,
    );
  }

  @Post('/project/tree')
  async getProjectTree(
    @Body() getProjectDto: GetProjectDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getProjectTree(
      getProjectDto.id,
      user.gitAccessToken,
      getProjectDto.file_path,
    );
  }

  @Post('/project/files')
  async getProjectFiles(
    @Body() getProjectDto: GetProjectDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getProjectFiles(
      getProjectDto.id,
      user.gitAccessToken,
      getProjectDto.file_path,
    );
  }

  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.repository.getAllProjectList')
  async microGetAllProjectList(
    @MicroPayload() getGitAllProjectListDto: GetGitAllProjectListDto,
    user: IPayloadUser,
  ) {
    return this.repositoryService.getAllProjectList(
      { simple: true, ...getGitAllProjectListDto },
      user?.gitAccessToken || '',
    );
  }

  @Post('/branch/create')
  async createBranch(
    @Body() branch: BranchDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.createBranch(branch, user.gitAccessToken);
  }

  @Post('/branch/list')
  async branchList(
    @Body() branch: BranchDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getBranchList(branch, user.gitAccessToken);
  }

  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.repository.getBranchList')
  async microGetBranchList(@Body() branch: BranchDto, user: IPayloadUser) {
    return this.repositoryService.getBranchList(
      branch,
      user?.gitAccessToken || '',
    );
  }

  @Post('/mr/create')
  async createMR(
    @Body() mr: MergeRequestDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.createMR(mr, user.gitAccessToken);
  }

  @Post('/mr/getOne')
  async getSingleMR(
    @Body() mr: MergeRequestDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getSingleMR(mr, user.gitAccessToken);
  }

  @Post('/mr/list')
  async getProjectMRList(
    @Body() mr: MRSearchConditionDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getProjectMRList(mr, user.gitAccessToken);
  }

  @Post('/mr/search')
  async searchMR(
    @Body() mr: MRSearchConditionDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.searchMR(mr, user.gitAccessToken);
  }

  @Post('mr/changes')
  async getSingleMRChanges(
    @Body() mergeRequestChangeDto: MergeRequestChangeDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.getSingleMRChanges(
      mergeRequestChangeDto,
      user.gitAccessToken,
    );
  }

  @Post('mr/accept')
  async acceptMR(
    @Body() mergeRequest: MergeRequestDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    return this.repositoryService.acceptMR(mergeRequest, user.gitAccessToken);
  }

  @Post('/user/listAll')
  @Public()
  async listAllUsers() {
    return this.repositoryService.getAllUsersByAdmin({
      page: 1,
      per_page: 100,
    });
  }

  @Post('/user/createPersonalToken')
  @Public()
  async createPersonalTokenByAdmin() {
    return this.repositoryService.createPersonalTokenByAdmin(542, 'autoToken');
  }

  @Post('/getCommits')
  @Public()
  async getCommits(@Body() params: IGitCommitsDto): Promise<any> {
    return this.repositoryService.getCommits(params);
  }

  @Post('/getGitCommitsDiff')
  @Public()
  async getGitCommitsDiff(@Body() params: IGitCommitsDto): Promise<any> {
    return this.repositoryService.getGitCommitsDiff(params);
  }
}
