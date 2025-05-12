import { Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CustomPaginationMeta, getPaginationOptions } from '@app/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { PrivilegeListWithPaginationDto } from './privilege.dto';
import { Privilege } from './privilege.mongo.entity';

@Injectable()
export class PrivilegeService {
  constructor(
    @Inject('PRIVILEGE_REPOSITORY')
    private privilegeRepository: MongoRepository<Privilege>,
  ) { }

  createOrUpdate(privilege: Privilege) {
    return this.privilegeRepository.save(privilege);
  }

  list(systemId: string) {
    return this.privilegeRepository.find({
      where: {
        systemId,
      },
    });
  }

  listByResourceKey(resourceKey: string) {
    return this.privilegeRepository.find({
      where: {
        resourceKey,
      },
    });
  }

  findById(id) {
    return this.privilegeRepository.findOne(id);
  }

  findByIds(ids: string[]) {
    return this.privilegeRepository.find({
      where: {
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      },
    });
  }

  delete(id: string) {
    return this.privilegeRepository.delete(new ObjectId(id));
  }

  async paginate(
    searchParams: PrivilegeListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Privilege, CustomPaginationMeta>> {
    const queryBuilder =
      this.privilegeRepository.createQueryBuilder('privilege');
    queryBuilder.orderBy('privilege.createTime', 'DESC');

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere({
        name: { $regex: searchParams.keyword, $options: 'i' },
      });
    }

    return paginate<Privilege, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }
}
