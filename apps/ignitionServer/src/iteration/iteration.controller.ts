import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IterationService } from './iteration.service';
import { IterationDeployDto, IterationDetailDto, IterationUpdateDto } from './iteration.dto';
import { compareVersions, PayloadUser } from '@app/common';
import { ITERATION_STATUS } from './iteration.mongo.entity';
import { DELETE_FALG, ENV_TYPE } from '@ignitionServer/application/application.mongo.entity';
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
    summary: '发布迭代',
  })
  @Post('deploy')
  async deploy(@Body() iteration: IterationDeployDto,
    @PayloadUser() user: IPayloadUser,) {
    const { userId, username } = user;
    const { id, env, schema } = iteration;
    const orginIteration = await this.iterationService.findOne(id);

    if (!orginIteration) {
      throw new Error('迭代不存在');
    }

    const orginPage = await this.pageService.findOne(orginIteration.pageId);
    const app = await this.applicationService.findOne(orginPage.appId);
    const domain = app.domains.filter(d => d.env === env)[0];

    let reIteration = orginIteration;

    if (schema) {
      reIteration = {
        ...orginIteration,
        schema,
      };
    }

    // 生产前判断是否测试环境发布过
    if (env === ENV_TYPE.prod) {
      const testPageVersion = await this.pageService.findPageVersionOne({
        page: orginPage,
        env: ENV_TYPE.test,
      });

      if (!testPageVersion || testPageVersion.iterationId !== id) {
        throw new Error('此迭代未再测试环境发布，不能直接发布生产');
      }

      reIteration = {
        ...orginIteration,
        status: ITERATION_STATUS.finish,
      };
    }

    const existPageVersion = await this.pageService.findPageVersionOne({
      page: orginPage,
      env,
    });

    await this.iterationService.saveAndUpdate(reIteration);

    if (existPageVersion) {
      await this.pageService.saveAndUpdatePageVersion({
        ...existPageVersion,
        env,
        version: orginIteration.version,
        iterationId: iteration.id,
      });
    } else {
      const reOrginPageVersions =
        await this.pageService.saveAndUpdatePageVersion({
          env,
          version: orginIteration.version,
          iterationId: orginIteration.id,
        });

      await this.pageService.save({ ...orginPage, });
    }

    return {
      env,
      status: reIteration.status,
    };
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
