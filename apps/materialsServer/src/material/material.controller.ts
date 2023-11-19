import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayloadUser } from '@app/common';
import {
  addMaterialDto,
  editMaterialDetailDto,
  ProcessNodes,
  PublishDto,
  searchMaterialByIdsDto,
  searchMaterialDetailDto,
  searchMaterialDto,
} from './physical/physical.dto';
import { MultrepoGroupService } from '../group/multrepo/multrepoGroup.service';
import { MaterialConfigService } from './config/materialConfig.service';
import { VirtualMaterialService } from './virtual/virtual.service';
import { MonorepoGroupService } from '../group/monorepo/monorepoGroup.service';

import {
  versionTypeMap,
  versionMap,
  ProcessMap,
} from './physical/physical.dto';
import { Public } from '@app/common';
import { MessagePattern, Payload as MicroPayload } from '@nestjs/microservices';
import { CodeGroupService } from '../group/code/code.service';
import { TaskService } from '../task/task.service';
import { PhysicalMaterialService } from './physical/physical.service';
import { PublishStatus } from '../task/task.mongo.entity';

@ApiTags('物料')
@Controller('material')
export class MaterialController {
  constructor(
    private multrepoGroupService: MultrepoGroupService,
    private groupService: CodeGroupService,
    private monorepoGroupService: MonorepoGroupService,
    private materialConfigService: MaterialConfigService,
    private virtualMaterialService: VirtualMaterialService,
    private physicalMaterialService: PhysicalMaterialService,
    private taskService: TaskService,
  ) { }

  @Post('savePhysical')
  async save(@Body() params: addMaterialDto, @PayloadUser() user: Payload) {
    const { type, groupId, ...rest } = params;

    return this.physicalMaterialService.save({
      type,
      groupId,
      updateUser: user.username,
    });
  }

  @Post('saveVirtual')
  async saveVirtual(
    @Body() params: addMaterialDto,
    @PayloadUser() user: Payload,
  ) {
    return this.virtualMaterialService.save({
      ...params,
      updateUser: user.username,
    });
  }

  @Post('editVirtual')
  async editVirtual(
    @Body() params: editMaterialDetailDto,
    @PayloadUser() user: Payload,
  ) {
    const { id, ...res } = params;
    return this.virtualMaterialService.updateOne(id, {
      ...res,
      updateUser: user.username,
    });
  }

  @Post('edit')
  async edit(
    @Body() params: editMaterialDetailDto,
    @PayloadUser() user: Payload,
  ) {
    const { id, type, groupId, ...res } = params;
    const material = await this.physicalMaterialService.findOne(params.id);
    return this.physicalMaterialService.updateOne(id, {
      type,
      groupId,
      updateUser: user.username,
    });
  }

  @Post('getVirtualList')
  async getVirtualList(@Body() params: searchMaterialDto) {
    const materialList = await this.virtualMaterialService.getList(params);
    const monorepoGroup = await this.monorepoGroupService.findOne(
      params.groupId,
    );
    for (const [idx, material] of materialList.entries()) {
      materialList[idx] = {
        ...material,
      };
    }
    return materialList;
  }

  @Post('getList')
  async getList(@Body() params: searchMaterialDto) {
    const materialList = await this.physicalMaterialService.getList(
      params.groupId ? params : '',
    );
    for (const [idx, material] of materialList.entries()) {
      materialList[idx] = {
        ...material,
      };
    }
    return materialList;
  }

  @Post('getListByIds')
  async getListByBizIds(@Body() params: searchMaterialByIdsDto) {
    const { env, groupIds } = params;
    const groupList: any = await this.groupService.getListByIds(groupIds);
    const changeEev = ProcessMap[env];
    for (const [gIdx, group] of groupList.entries()) {
      const materialList = await this.physicalMaterialService.getList({
        groupId: String(group.id),
      });
      for (const [idx, material] of materialList.entries()) {
        const config = await this.materialConfigService.findOne(
          material[changeEev],
        );
        materialList[idx] = {
          ...material,
          // config,
        };
      }
      groupList[gIdx] = {
        ...group,
        materialList,
      };
    }
    return groupList;
  }

  @Post('getDetail')
  async getDetail(@Body() params: searchMaterialDetailDto) {
    const material = await this.physicalMaterialService.findOne(params.id);
    return {
      ...material,
    };
  }

  @Public()
  @MessagePattern('material.project.getDetail')
  getDetailMicro(@MicroPayload() projectDetailDto: searchMaterialDetailDto) {
    return this.physicalMaterialService.findOneByProjectId(
      projectDetailDto.projectId,
    );
  }

  @Post('publish')
  async publish(@Body() publishDto: PublishDto, @PayloadUser() user: Payload) {
    const { id, branch, version, environment, desc } = publishDto;
    const material = await this.physicalMaterialService.findOne(id);

    let deployVersion = version;
    let deployNum = 1;

    if (environment !== ProcessNodes.production) {
      if (
        version !== material.currentVersion ||
        !material[versionMap[environment]]
      ) {
        deployVersion = `${deployVersion}-${versionTypeMap[environment]}.1`;
      } else {
        deployVersion = `${deployVersion}-${versionTypeMap[environment]}.${material[versionMap[environment]] + 1
          }`;
        deployNum = material[versionMap[environment]] + 1;
      }
    }

    const task = await this.taskService.save({
      branch,
      materialId: String(material.id),
      status: PublishStatus.unpublished,
      env: environment,
      creatorName: user.name,
      creatorId: user.userId,
      desc,
      deployNum,
      deployVersion,
      version,
      currentVersion: material.currentVersion,
    });

    /**
     * @description: 缺少真实调用构建逻辑
     */
    return task;
  }
}
