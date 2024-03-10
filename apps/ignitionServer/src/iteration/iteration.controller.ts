import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IterationService } from './iteration.service';
import { IterationDetailDto, IterationUpdateDto } from './iteration.dto';
import { compareVersions, PayloadUser } from '@app/common';
import { ITERATION_STATUS } from './iteration.mongo.entity';
import { DELETE_FALG } from '@ignitionServer/application/application.mongo.entity';
import { PageService } from '@ignitionServer/pages/page.service';
import { ApplicationService } from '@ignitionServer/application/application.service';

@ApiTags('迭代配置')
@Controller('iteration')
export class IterationController {
  constructor(
    private readonly iterationService: IterationService,
    private readonly pageService: PageService,
    private readonly applicationService: ApplicationService,
  ) { }

  @ApiOperation({
    summary: '迭代新增与更新',
  })
  @Post('saveAndUpdate')
  async saveAndUpdate(
    @Body() iteration: IterationUpdateDto,
    @PayloadUser() user: IPayloadUser,
  ) {

    const { pageId, version, id } = iteration;

    const page = await this.pageService.findOne(pageId);

    const { userId, username } = user;

    if (!page) {
      throw new Error('没有此页面');
    }

    const latserVersion = await this.iterationService.findLatest(pageId);

    if (latserVersion && !id) {
      if (latserVersion && !compareVersions(version, latserVersion.version)) {
        throw new Error('迭代版本号只能递增，不能降低');
      }
      if (latserVersion.status === ITERATION_STATUS.inporcess) {
        throw new Error('存在进行中的迭代，暂时无法新建迭代');
      }
    }

    if (id) {
      return this.iterationService.saveAndUpdate({
        ...iteration,
        updatedUser: username,
        updatedId: userId,
      });
    }

    return this.iterationService.saveAndUpdate({
      ...iteration,
      schema: latserVersion?.schema || {},
      createdUser: username,
      createdId: userId,
    });
  }

  @ApiOperation({
    summary: '更新迭代',
  })
  @Post('update')
  async update(@Body() iteration: IterationUpdateDto,
    @PayloadUser() user: IPayloadUser,) {
    const { id } = iteration;
    const orginIteration = await this.iterationService.findOne(id);

    const { userId, username } = user;

    if (!orginIteration) {
      throw new Error('迭代不存在');
    }

    return this.iterationService.saveAndUpdate({
      ...orginIteration,
      ...iteration,
      updatedUser: username,
      updatedId: userId,
    });
  }

  @ApiOperation({
    summary: '更新 schema',
  })
  @Post('saveSchema')
  async saveSchema(@Body() iteration: IterationUpdateDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const { id, schema } = iteration;
    const orginIteration = await this.iterationService.findOne(id);

    const { userId, username } = user;

    if (!orginIteration) {
      throw new Error('迭代不存在');
    }

    return this.iterationService.saveAndUpdate({
      ...orginIteration,
      schema,
      updatedUser: username,
      updatedId: userId,
    });
  }


  @ApiOperation({
    summary: '获取迭代列表',
  })
  @Post('getList')
  async getList() {
    const application = await this.iterationService.findALL();
    return application;
  }

  @ApiOperation({
    summary: '删除迭代',
  })
  @Post('delete')
  async deletePage(
    @Body() iteration: IterationDetailDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const { id } = iteration;

    const orginIteration = await this.iterationService.findOne(id);

    if (!orginIteration) {
      throw new Error('迭代不存在');
    }

    return this.iterationService.saveAndUpdate({
      ...orginIteration,
      deleteFlag: DELETE_FALG.disabled,
    });
  }

  @ApiOperation({
    summary: '迭代详情',
  })
  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const OriginIteration = await this.iterationService.findOne(id);
    const page = await this.pageService.findOne(OriginIteration.pageId);
    const app = await this.applicationService.findOne(page.appId);
    return {
      iteration: OriginIteration,
      page,
      app,
    };
  }
}
