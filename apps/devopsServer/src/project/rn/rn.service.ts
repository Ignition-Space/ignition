import { Inject, Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions, CustomPaginationMeta } from '@app/common';
import { In, Repository } from 'typeorm';
import { RNBundleHistory } from './rn-bundle-history.entity';
import {
  BundleUseStrategy,
  NativeBindedBundles,
} from './rn-native-bind.entity';
import {
  BindRNProjectBundleDto,
  BundleVersionsDto,
  GetRNProjectBundleListDto,
  NativeBindedBundlesDto,
  RNBundle,
  RNBundleHistoryWithPaginationDto,
} from './rn.dto';
import { mergeWith, groupBy, keyBy, values } from 'lodash';
@Injectable()
export class RnService {
  constructor(
    @Inject('RN_BUNDLE_HISTORY_REPOSITORY')
    private readonly rnBundleHistoryRepository: Repository<RNBundleHistory>,
    @Inject('NATIVE_BINDED_BUNDLES')
    private readonly nativeBindedBundlesRepository: Repository<NativeBindedBundles>,
  ) { }

  createOrUpdate(rnBundle: RNBundleHistory) {
    return this.rnBundleHistoryRepository.save<RNBundleHistory>(rnBundle);
  }

  /**
   * 根据`项目名称`、`版本号`、`逗号分隔的模块列表字符串`、`平台类型`，查找唯一的 bundle。
   */
  findOne(rnBundle: RNBundle) {
    return this.rnBundleHistoryRepository.findOne({
      where: {
        projectName: rnBundle.projectName,
        version: rnBundle.version,
        moduleNames: rnBundle.moduleNames,
        platform: rnBundle.platform,
      },
    });
  }

  /**
   * 查找指定版本号的 bundle 信息
   */
  find(rnBundles: NativeBindedBundles[]) {
    if (rnBundles.length === 0) return [];
    const list = rnBundles.map((item) => ({
      projectId: item.projectId,
      version: item.version,
      moduleNames: item.moduleNames,
      platform: item.platform,
    }));
    return this.rnBundleHistoryRepository.find({
      where: list,
    });
  }

  /**
   * 查找最后一次发布的 bundle 信息
   */
  findOneByLatestDeployTime(rnBundle: NativeBindedBundles) {
    return this.rnBundleHistoryRepository.findOne({
      order: {
        version: 'DESC',
      },
      // 使用 latest 策略，忽略 version 字段查询
      where: {
        projectId: rnBundle.projectId,
        moduleNames: rnBundle.moduleNames,
        platform: rnBundle.platform,
      },
    });
  }

  findByIds(bundleIds: number[]) {
    return this.rnBundleHistoryRepository.find({
      where: {
        bundleId: In(bundleIds),
      },
    });
  }

  /**
   * 通过 native 项目的 id，获取已绑定的 bundle 包列表
   */
  async nativeBindedBundles({
    nativeProjectId,
    platform,
  }: NativeBindedBundlesDto) {
    const bindedBundles = await this.nativeBindedBundlesRepository.find({
      where: {
        nativeProjectId,
        platform,
      },
    });

    // 根据使用策略分组
    const grouped = groupBy(Array.from(bindedBundles), 'useStrategy');

    if (Object.keys(grouped).length === 0) {
      return [];
    }

    const latestVersionBundles = await Promise.all(
      (grouped[BundleUseStrategy.latest] || []).map((item) =>
        this.findOneByLatestDeployTime(item),
      ),
    );

    // 标记使用策略
    latestVersionBundles.forEach(
      (item) => (item['useStrategy'] = BundleUseStrategy.latest),
    );

    const fixedVersionBundles = await this.find(
      grouped[BundleUseStrategy.fixed_verson] || [],
    );
    // 标记使用策略
    fixedVersionBundles.forEach(
      (item) => (item['useStrategy'] = BundleUseStrategy.fixed_verson),
    );
    const bundleList: RNBundleHistory[] = [
      ...latestVersionBundles,
      ...fixedVersionBundles,
    ];

    // 聚合 bundleList 和 bindedBundles
    const mergeKey = <T extends NativeBindedBundles | RNBundleHistory>(
      value: T,
    ) => {
      return `${value.moduleNames}-${value.projectId}-${value.platform}`;
    };
    const merged = mergeWith(
      keyBy<NativeBindedBundles>(bindedBundles, mergeKey),
      keyBy<RNBundleHistory>(bundleList, mergeKey),
      (bindedBundle: NativeBindedBundles, bundle: RNBundleHistory) => {
        return { ...bindedBundle, ...bundle };
      },
    );
    return values(merged);
  }

  getRNProjectBundleList({ projectId, platform }: GetRNProjectBundleListDto) {
    return this.rnBundleHistoryRepository.find({
      where: {
        projectId,
        platform,
      },
    });
  }

  /**
   * 绑定 RN Bundle
   */
  bindRNProjectBundle(params: BindRNProjectBundleDto) {
    return this.nativeBindedBundlesRepository.save(params);
  }

  findOneBinded(params: BindRNProjectBundleDto) {
    return this.nativeBindedBundlesRepository.findOne({
      where: {
        nativeProjectId: params.nativeProjectId,
        platform: params.platform,
        moduleNames: params.moduleNames,
        projectId: params.projectId,
      },
    });
  }

  /**
   * 通过 bindedId 查找 bindedBundle
   * @param bindedId
   */
  findOneBindedById(bindedId: number) {
    return this.nativeBindedBundlesRepository.findOne({
      where: {
        bindedId,
      },
    });
  }

  /**
   * native 和 rn bundle 解绑
   * @param bindedId native 和 rn bundle 关联 id
   * @returns
   */
  unbindRNProjectBundle(bindedId: number) {
    return this.nativeBindedBundlesRepository.delete(bindedId);
  }

  /**
   * 根据 `projectId`、`moduleNames`、以及`platform` 精准匹配 bundle 的多个版本
   */
  bundleVersions(params: BundleVersionsDto) {
    return this.rnBundleHistoryRepository.find({
      order: {
        version: 'DESC',
      },
      where: params,
    });
  }

  async paginate(
    searchParams: RNBundleHistoryWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<RNBundleHistory, CustomPaginationMeta>> {
    const queryBuilder =
      this.rnBundleHistoryRepository.createQueryBuilder('rn_bundle_history');
    queryBuilder.orderBy('project.createTime', 'DESC');

    return paginate<RNBundleHistory, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }
}
