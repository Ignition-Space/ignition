import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CustomPaginationMeta, BusinessException, Public } from '@app/common';
import { Platform, RNBundleHistory } from './rn-bundle-history.entity';
import { NativeBindedBundles } from './rn-native-bind.entity';
import {
  BindRNProjectBundleDto,
  BundleVersionsDto,
  EditBindedBundleDto,
  GetRNProjectBundleListDto,
  NativeBindedBundlesDto,
  RNBundle,
  RNBundleHistoryWithPaginationDto,
  UnbindRNProjectBundleDto,
} from './rn.dto';
import { RnService } from './rn.service';
import { Omit } from 'lodash';

interface BundleItem
  extends Omit<NativeBindedBundles, 'moduleNames'>,
  Omit<RNBundleHistory, 'moduleNames'> {
  moduleNames: string[];
}

type BundlesMap = {
  [bundleId: string]: BundleItem;
};

@ApiTags('RN')
@Controller('rn')
export class RnController {
  constructor(private rnService: RnService) { }

  @ApiOperation({
    summary: '创建或更新发布 RN 业务包的记录。改接口提供给 RN CI 回调',
  })
  @Post('/createOrUpdate')
  @Public()
  async create(@Body() rnBundle: RNBundle) {
    const rnBundleHistory = await this.rnService.findOne(rnBundle);
    if (rnBundleHistory) {
      const updateBundle = { ...rnBundle, bundleId: rnBundleHistory.bundleId };
      return await this.rnService.createOrUpdate(updateBundle);
    }
    return await this.rnService.createOrUpdate(rnBundle);
  }

  @ApiOperation({
    summary: '获取 Native 已绑定的 RN bundle 列表',
  })
  @Post('list/binded')
  getBindedRNBundleList(@Body() params: NativeBindedBundlesDto) {
    return this.rnService.nativeBindedBundles(params);
  }

  @ApiOperation({
    summary: 'Native 获取 manifest 配置，用于 Native CI 构建集成 RN 包',
  })
  @Get('project/:id/manifest/:platform')
  @Public()
  async nativeDelpoyMainfest(
    @Param('id') nativeProjectId: number,
    @Param('platform') platform: Platform,
  ) {
    const params = { nativeProjectId, platform };
    const list = await this.rnService.nativeBindedBundles(params);
    const bundlesMap: BundlesMap = {};
    const modulesMap: { [moduleName: string]: number } = {};
    list.map((bundle) => {
      const moduleNames = bundle.moduleNames?.split(',') || [];
      bundlesMap[bundle.bundleId] = { ...bundle, moduleNames };
      moduleNames.forEach((moduleName) => {
        modulesMap[moduleName] = bundle.bundleId;
      });
    });
    return {
      bundlesMap,
      modulesMap,
    };
  }

  @ApiOperation({
    summary: '通过 RN 项目英文名称（唯一的）查找它的所有已发布 bundle 列表',
  })
  @Post('list/bundles')
  getRNProjectBundleList(@Body() params: GetRNProjectBundleListDto) {
    return this.rnService.getRNProjectBundleList(params);
  }

  @ApiOperation({
    summary: '绑定 RN Bundle',
  })
  @Post('bundle/bind')
  async bindRNProjectBundle(@Body() params: BindRNProjectBundleDto) {
    const bindedBundle = await this.rnService.findOneBinded(params);
    if (bindedBundle) {
      throw new BusinessException('该 Bundle 已绑定过了哦~');
    }
    return this.rnService.bindRNProjectBundle(params);
  }

  @ApiOperation({
    summary: '解除 RN Bundle',
  })
  @Post('bundle/unbind')
  async unbindRNProjectBundle(@Body() { bindedId }: UnbindRNProjectBundleDto) {
    const bindedBundle = await this.rnService.findOneBindedById(bindedId);
    if (!bindedBundle) {
      throw new BusinessException('您未曾绑定该 Bundle 哦~');
    }
    return this.rnService.unbindRNProjectBundle(bindedId);
  }
  @ApiOperation({
    summary: '获取 Bundle 所有版本号',
  })
  @Post('/bundle/versions')
  async bundleVersions(@Body() param: BundleVersionsDto) {
    const list = await this.rnService.bundleVersions(param);
    return list.map((item) => item.version);
  }

  @ApiOperation({
    summary: '编辑已绑定 bundle',
  })
  @Post('/bundle/binded/edit')
  async editBindedBundle(@Body() param: EditBindedBundleDto) {
    const bindedBundle = await this.rnService.findOneBindedById(param.bindedId);
    if (!bindedBundle) {
      throw new BusinessException('未找到该绑定的 bundle 信息~');
    }
    return await this.rnService.bindRNProjectBundle({
      ...bindedBundle,
      ...param,
    });
  }

  @ApiOperation({
    summary: 'RN Bundle 历史列表（分页）',
  })
  @Post('bundle/list/pagination')
  async listWithPagination(
    @Body() listWithPaginationDto: RNBundleHistoryWithPaginationDto,
  ): Promise<Pagination<RNBundleHistory, CustomPaginationMeta>> {
    const { page, ...searchParams } = listWithPaginationDto;
    return await this.rnService.paginate(searchParams, page);
  }
}
