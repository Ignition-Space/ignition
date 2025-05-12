import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PrivilegeService } from '../privilege/privilege.service';
import { SystemService } from '../system/system.service';
import { getPaginationOptions, CustomPaginationMeta } from '@app/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { ResourceListWithPaginationDto } from './resource.dto';
import { Resource } from './resource.mongo.entity';

@Injectable()
export class ResourceService {
  constructor(
    @Inject('RESOURCE_REPOSITORY')
    private resourceRepository: MongoRepository<Resource>,
    private readonly privilegeService: PrivilegeService,
    private readonly systemService: SystemService,
  ) { }

  createOrUpdate(resource: Resource) {
    return this.resourceRepository.save(resource);
  }

  findByKey(key: string) {
    return this.resourceRepository.findOne({
      where: {
        key,
      },
    });
  }

  findById(id) {
    return this.resourceRepository.findOne(id);
  }

  async delete(id: string) {
    return await this.resourceRepository.delete(new ObjectId(id));
  }

  async paginate(
    searchParams: ResourceListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Resource, CustomPaginationMeta>> {
    const queryBuilder = this.resourceRepository.createQueryBuilder('resource');
    queryBuilder.orderBy('resource.sort', 'ASC');

    // 系统
    if (isNotEmpty(searchParams.systemId)) {
      queryBuilder.andWhere({
        systemId: searchParams.systemId,
      });
    }

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere({
        $or: [
          { name: { $regex: searchParams.keyword, $options: 'i' } },
          { key: { $regex: searchParams.keyword, $options: 'i' } },
        ],
      });
    }

    return paginate<Resource, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }

  list(systemId: string) {
    return this.resourceRepository.find({
      where: {
        systemId,
      },
    });
  }
}
