import { Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { In, Repository } from 'typeorm';
import { PrivilegeListWithPaginationDto } from './privilege.dto';
import { Privilege } from './privilege.mysql.entity';

@Injectable()
export class PrivilegeService {
  constructor(
    @Inject('PRIVILEGE_REPOSITORY') private privilegeRepository: Repository<Privilege>,
  ) { }

  createOrUpdate(privilege: Privilege) {
    return this.privilegeRepository.save(privilege);
  }

  list(systemId: number) {
    return this.privilegeRepository.find({
      where: {
        systemId
      }
    });
  }

  findById(id) {
    return this.privilegeRepository.findOne(id);
  }

  findByIds(ids: number[]) {
    return this.privilegeRepository.find({
      where: {
        id: In(ids)
      }
    });
  }

  delete(id: number) {
    return this.privilegeRepository.delete(id)
  }

  async paginate(
    searchParams: PrivilegeListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Privilege, CustomPaginationMeta>> {
    const queryBuilder = this.privilegeRepository.createQueryBuilder('privilege');
    queryBuilder.orderBy('privilege.createTime', 'DESC');

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('privilege.name LIKE :name', {
        name: `%${searchParams.keyword}%`,
      });
    }

    return paginate<Privilege, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }
}
