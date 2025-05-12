import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { RolePrivilege } from './role-privilege.mongo.entity';

@Injectable()
export class RolePrivilegeService {
  constructor(
    @Inject('ROLE_PRIVILEGE_REPOSITORY')
    private rolePrivilegeRepository: MongoRepository<RolePrivilege>,
  ) { }

  listByRoleIds(roleIds: string[]) {
    return this.rolePrivilegeRepository.find({
      where: {
        roleId: { $in: roleIds },
      },
    });
  }

  remove(roleId: string) {
    return this.rolePrivilegeRepository.delete({
      roleId,
    });
  }

  set(roleId: string, privilegeIds: string[], systemId: string) {
    const rolePrivileges: RolePrivilege[] = privilegeIds.map((privilegeId) => {
      return {
        systemId,
        roleId,
        privilegeId,
      };
    });
    return this.rolePrivilegeRepository.save(rolePrivileges);
  }
}
