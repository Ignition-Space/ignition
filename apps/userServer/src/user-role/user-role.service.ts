import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { UserRole } from './user-role.mongo.entity';
import { IBathRole } from '../user/user.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @Inject('USER_ROLE_REPOSITORY')
    private userRoleRepository: MongoRepository<UserRole>,
  ) { }

  listByUserId(userId: string) {
    return this.userRoleRepository.find({
      where: {
        userId,
      },
    });
  }

  listByUserIdWithSys(userId: string, systemId: string) {
    return this.userRoleRepository.find({
      where: {
        systemId,
        userId,
      },
    });
  }

  deleteByUserId(userId: string, systemId: string) {
    return this.userRoleRepository.deleteMany({
      userId,
      systemId,
    });
  }

  async setUserRoles(userId: string, bathRoles: IBathRole[]) {
    let userRoles: UserRole[] = [];

    for (const sys of bathRoles) {
      await this.deleteByUserId(userId, sys.systemId);
      userRoles = [
        ...userRoles,
        ...sys.roleIds.map((roleId) => {
          return {
            userId,
            roleId,
            systemId: sys.systemId,
          };
        }),
      ];
    }

    return await this.userRoleRepository.save(userRoles);
  }
}
