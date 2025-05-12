import { Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { RolePrivilegeService } from '../role-privilege/role-privilege.service';
import { SystemService } from '../system/system.service';
import { getPaginationOptions, CustomPaginationMeta } from '@app/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { RoleListWithPaginationDto } from './role.dto';
import { Role } from './role.mongo.entity';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY') private roleRepository: MongoRepository<Role>,
    private readonly rolePrivilegeService: RolePrivilegeService,
    private readonly systemService: SystemService,
  ) { }

  create(role) {
    return this.roleRepository.save(role);
  }

  update(role: Role) {
    return this.roleRepository.save(role);
  }

  async delete(id: string) {
    // 同步删除角色和权限关系表
    await this.rolePrivilegeService.remove(id);
    return await this.roleRepository.delete(new ObjectId(id));
  }

  findById(id) {
    return this.roleRepository.findOne(id);
  }

  findByIds(ids: string[]) {
    return this.roleRepository.find({
      where: {
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      },
    });
  }

  async paginate(
    searchParams: RoleListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Role, CustomPaginationMeta>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    // queryBuilder.orderBy('role.createTime', 'DESC');

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere({
        name: { $regex: searchParams.keyword, $options: 'i' },
      });
    }

    return paginate<Role, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }

  async listWithSys(systemId: string) {
    const roles = await this.roleRepository.find({
      where: {
        systemId,
      },
    });
    return roles;
  }
}
