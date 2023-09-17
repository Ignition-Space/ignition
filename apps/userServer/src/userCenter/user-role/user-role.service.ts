import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.mysql.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @Inject('USER_ROLE_REPOSITORY')
    private userRoleRepository: Repository<UserRole>,
  ) { }

  listByUserId(userId: number, systemId: number) {
    return this.userRoleRepository.find({
      where: {
        systemId,
        userId
      }
    })
  }

  deleteByUserId(userId: number, systemId: number) {
    return this.userRoleRepository.delete({
      userId,
      systemId
    })
  }

  async setUserRoles(userId: number, roleIds: number[], systemId: number) {
    const userRoles: UserRole[] = roleIds.map(roleId => {
      return {
        userId,
        roleId,
        systemId
      }
    })
    await this.deleteByUserId(userId, systemId);
    return await this.userRoleRepository.save(userRoles)
  }

}
