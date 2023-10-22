import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayloadUser } from '@app/common';
import { MonorepoGroupService } from './monorepo/monorepoGroup.service';
import { MultrepoGroupService } from './multrepo/multrepoGroup.service';
import { TaskService } from '../task/task.service';
import { ProjectService } from '../project/project.service';
import { addGroupDto, getGroupDto, } from './multrepo/multrepoGroup.dto';
import { addMonorepoGroupDto } from './monorepo/monorepoGroup.dto';
import { BusinessException } from '@app/common';
import { PublishStatus } from '../task/task.mongo.entity';
import { ProcessNodes, PublishDto, versionMap, versionTypeMap } from '../material/physical/physical.dto';

@ApiTags('物料库配置')
@Controller('group')
export class GroupController {
  constructor(
    private monorepoGroupService: MonorepoGroupService,
    private multrepoGroupService: MultrepoGroupService,
    private taskService: TaskService,
    private projectService: ProjectService,
  ) {
  }

  @Post('save')
  multrepoSave(
    @Body() params: addGroupDto,
    @PayloadUser() user: Payload,
  ) {
    return this.multrepoGroupService.save({
      ...params,
      creatorName: user.username,
      creatorId: user.userId
    })
  }

  @Post('monorepoSave')
  async monorepoSave(
    @Body() params: addMonorepoGroupDto,
    @PayloadUser() user: Payload,
  ) {
    const { type, bizId, name, bizTitle, ...rest } = params
    const project: any = await this.projectService.saveAndUpdate({
      createProjectDto: rest,
      user
    })

    if (project.status === 'error') {
      throw new BusinessException('该仓库已被绑定')
    }

    return this.monorepoGroupService.save({
      ...params,
      creatorName: user.username,
      creatorId: user.userId,
      projectId: project.id
    })
  }


  @Post('publish')
  async publish(@Body() publishDto: PublishDto, @PayloadUser() user: Payload) {

    const { id, branch, version, environment, desc } = publishDto

    const material = await this.monorepoGroupService.findOne(id)

    const project = await this.projectService.findOne({ id: material.projectId })

    const projectType = project.projectTypes.length > 1 ? 'cnpm' : project.projectTypes[0]

    let deployVersion = version
    let deployNum = 1

    if (environment !== ProcessNodes.production) {
      if (version !== material.currentVersion || !material[versionMap[environment]]) {
        deployVersion = `${deployVersion}-${versionTypeMap[environment]}.1`
      } else {
        deployVersion = `${deployVersion}-${versionTypeMap[environment]}.${material[versionMap[environment]] + 1}`
        deployNum = material[versionMap[environment]] + 1
      }
    }

    const task = await this.taskService.save({
      projectId: project.id,
      branch,
      groupId: String(material.id),
      status: PublishStatus.unpublished,
      env: environment,
      projectType,
      creatorName: user.name,
      creatorId: user.userId,
      desc,
      deployNum,
      deployVersion,
      version,
      currentVersion: material.currentVersion
    })

    return task
  }

  @Post('getList')
  async getList() {
    const multrepo = await this.multrepoGroupService.getListByParams({})
    const monorepo = await this.monorepoGroupService.getListByParams({})
    return [
      ...multrepo,
      ...monorepo
    ]
  }


  @Post('getMonorepoDetail')
  async getMonorepoGroupDetail(@Body() params: getGroupDto) {
    const monorepo = await this.monorepoGroupService.findOne(params.id)
    const project: any = await this.projectService.findOne(monorepo.projectId)
    return {
      ...project,
      ...monorepo,
    }
  }

  @Post('del')
  del(@Body() params: getGroupDto) {
    return this.multrepoGroupService.del(params.id)
  }
}

