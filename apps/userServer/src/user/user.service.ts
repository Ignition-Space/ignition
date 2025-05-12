import { ObjectId, MongoRepository } from 'typeorm';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { User } from './user.mongo.entity';
import { UserListWithPaginationDto } from './user.dto';
import { isNotEmpty } from 'class-validator';
import { GithubUserInfo } from './user.dto';
import {
  BusinessException,
  CustomPaginationMeta,
  encryptionPassword,
} from '@app/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { RolePrivilegeService } from '../role-privilege/role-privilege.service';
import { UserRoleService } from '../user-role/user-role.service';
import { UserRole } from '../user-role/user-role.mongo.entity';
import { RoleService } from '../role/role.service';
import { PrivilegeService } from '../privilege/privilege.service';

const _ = require('lodash');

type SyncUserInfo = {
  name: string;
  email: string;
  username: string;
  gitUserId: number;
};

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>,
    private readonly rolePrivilegeService: RolePrivilegeService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly privilegeService: PrivilegeService,
  ) { }

  createOrSave(user: User) {
    return this.userRepository.save(user);
  }

  findByUsername(name: string) {
    return this.userRepository.findOne({
      where: {
        username: name,
      },
    });
  }

  async findUserByLocal({ username, password }) {
    const encryption = await encryptionPassword(password);
    console.log(encryption);
    const findUser: User = await this.userRepository.findOne({
      where: {
        username,
        password: encryption,
      },
    });
    return findUser;
  }

  async createOrUpdateByOAoth(userInfo: GithubUserInfo) {
    const findUser: User = await this.userRepository.findOne({
      where: { email: userInfo.email },
    });

    return await this.userRepository.save({ ...findUser, ...userInfo });
  }

  profile(userId) {
    return this.userRepository.findOne(userId);
  }

  async paginate(
    searchParams: UserListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<User, CustomPaginationMeta>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.updateTime', 'DESC');
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere({
        $or: [
          { name: { $regex: searchParams.keyword, $options: 'i' } },
          { username: { $regex: searchParams.keyword, $options: 'i' } },
        ],
      });
    }
    return paginate<User, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }

  getUserListByEmails(emailList: string[]) {
    return this.userRepository.find({
      where: {
        email: { $in: emailList },
      },
    });
  }

  // 获取用户权限列表
  async getPrivilegeListByUserId(userId: string, systemId: string) {
    const userRoleList = await this.userRoleService.listByUserIdWithSys(
      userId,
      systemId,
    );
    const roleIds = userRoleList.map((i) => i.id.toString());
    const rolePrivilegeList =
      await this.rolePrivilegeService.listByRoleIds(roleIds);
    const privilegeIds = rolePrivilegeList.map((rp) => rp.privilegeId);
    const privilegeList = await this.privilegeService.findByIds([
      ...new Set(privilegeIds),
    ]);
    return privilegeList;
  }

  async getPrivilegeCodesByUserId(userId: string, systemId: string) {
    const userRoleList = await this.userRoleService.listByUserIdWithSys(
      userId,
      systemId,
    );
    const roleIds = userRoleList.map((i) => i.roleId.toString());
    const rolePrivilegeList =
      await this.rolePrivilegeService.listByRoleIds(roleIds);
    const privilegeIds = rolePrivilegeList.map((rp) => rp.privilegeId);
    const privilegeList = await this.privilegeService.findByIds([
      ...new Set(privilegeIds),
    ]);

    return privilegeList.map((p) => ({
      code: `${p.resourceKey}:${p.action}`,
      status: p.status,
    }));
  }

  // 获取用户角色列表
  async getAllRolesById(userId: string) {
    const userRoles: UserRole[] =
      await this.userRoleService.listByUserId(userId);
    const roleIds = userRoles.map((ur) => ur.roleId.toString());
    return await this.roleService.findByIds(roleIds);
  }

  // 获取用户角色列表
  async getRolesById(userId: string, systemId: string) {
    const userRoles: UserRole[] =
      await this.userRoleService.listByUserIdWithSys(userId, systemId);
    const roleIds = userRoles.map((ur) => ur.roleId.toString());
    return await this.roleService.findByIds(roleIds);
  }

  getUserById(id: string) {
    return this.userRepository.findOne(id);
  }

  getUserByFeishuId(feishuUserId: string) {
    return this.userRepository.findOne({
      where: {
        feishuUserId,
      },
    });
  }
}
