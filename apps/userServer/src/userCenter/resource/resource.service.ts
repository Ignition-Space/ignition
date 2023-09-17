import { Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions, CustomPaginationMeta } from '@app/common';
import { Repository } from 'typeorm';
import { CreateResourceDto, ResourceListWithPaginationDto, UpdateResourceDto } from './resource.dto';
import { Resource } from './resource.mysql.entity';

@Injectable()
export class ResourceService {
  constructor(
    @Inject('RESOURCE_REPOSITORY') private resourceRepository: Repository<Resource>,
  ) {

  }
  create(resource: Resource) {
    return this.resourceRepository.save(resource)
  }

  update(resource: Resource) {
    return this.resourceRepository.save(resource)
  }

  delete(id: number) {
    return this.resourceRepository.delete(id);
  }

  findById(id) {
    return this.resourceRepository.findOneBy(id)
  }

  findByKey(key: string) {
    return this.resourceRepository.findOne({
      where: {
        key
      }
    })
  }

  async paginate(
    searchParams: ResourceListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Resource, CustomPaginationMeta>> {
    const queryBuilder = this.resourceRepository.createQueryBuilder('resource');
    queryBuilder.orderBy('resource.createTime', 'DESC');

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('resource.name LIKE :name', {
        name: `%${searchParams.keyword}%`,
      });
    }

    return paginate<Resource, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }

  listBySystemId(systemId: number) {
    return this.resourceRepository.find({
      where: {
        systemId
      }
    });
  }
}
