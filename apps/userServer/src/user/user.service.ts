import { In, Like, Raw, Repository } from 'typeorm';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { User } from './user.mysql.entity';
import { UserListWithPaginationDto } from './user.dto';
import { isNotEmpty } from 'class-validator';
import { GithubUserInfo } from './user.dto';
import { BusinessException, CustomPaginationMeta, encryptionPassword } from '@app/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { RolePrivilegeService } from '../role-privilege/role-privilege.service';
import { UserRoleService } from '../user-role/user-role.service';
import { UserRole } from '../user-role/user-role.mysql.entity';
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
    private userRepository: Repository<User>,
    private readonly rolePrivilegeService: RolePrivilegeService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly privilegeService: PrivilegeService,
  ) { }

  createOrSave(user: User) {
    this.userRepository.save(user);
  }

  async findUserByLocal({ username, password }) {
    const encryption = await encryptionPassword(password);
    const findUser: User = await this.userRepository.findOne({
      where: [
        {
          username,
          password: encryption,
        },
      ],
    });
    return findUser;
  }

  async createOrUpdateByOAoth(userInfo: GithubUserInfo) {
    const findUser: User = await this.userRepository.findOne({
      where: [{ email: userInfo.email }],
    });

    return await this.userRepository.save({ ...findUser, ...userInfo });
  }

  profile(userId) {
    return this.userRepository.findOneBy(userId);
  }

  async paginate(
    searchParams: UserListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<User, CustomPaginationMeta>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.updateTime', 'DESC');
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('user.name LIKE :name', {
        name: `%${searchParams.keyword}%`,
      });
      queryBuilder.orWhere('user.username LIKE :name', {
        name: `%${searchParams.keyword}%`,
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
        email: In(emailList),
      },
    });
  }

  // 获取用户权限列表
  async getPrivilegeListByUserId(userId: number, systemId: number) {
    const userRoleList = await this.userRoleService.listByUserIdWithSys(
      userId,
      systemId,
    );
    const roleIds = userRoleList.map((i) => i.id);
    const rolePrivilegeList =
      await this.rolePrivilegeService.listByRoleIds(roleIds);
    const privilegeIds = rolePrivilegeList.map((rp) => rp.privilegeId);
    const privilegeList = await this.privilegeService.findByIds([
      ...new Set(privilegeIds),
    ]);
    return privilegeList;
  }

  async getPrivilegeCodesByUserId(userId: number, systemId: number) {
    const userRoleList = await this.userRoleService.listByUserIdWithSys(
      userId,
      systemId,
    );
    const roleIds = userRoleList.map((i) => i.roleId);
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
  async getAllRolesById(userId: number) {
    const userRoles: UserRole[] =
      await this.userRoleService.listByUserId(userId);
    const roleIds = userRoles.map((ur) => ur.roleId);
    return await this.roleService.findByIds(roleIds);
  }

  // 获取用户角色列表
  async getRolesById(userId: number, systemId: number) {
    const userRoles: UserRole[] =
      await this.userRoleService.listByUserIdWithSys(userId, systemId);
    const roleIds = userRoles.map((ur) => ur.roleId);
    return await this.roleService.findByIds(roleIds);
  }

  getUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  getUserByFeishuId(feishuUserId: string) {
    return this.userRepository.findOne({
      where: {
        feishuUserId,
      },
    });
  }
}
