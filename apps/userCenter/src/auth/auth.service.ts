import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { GithubUserInfo } from '../userCenter/user/feishu/feishu.dto';
import { FeishuService } from '../userCenter/user/feishu/feishu.service';
import { User } from '../userCenter/user/user.mysql.entity';
import { UserService } from '../userCenter/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private feishuService: FeishuService,
  ) { }

  async validateFeishuUser(code: string): Promise<Payload> {

    const feishuInfo: GithubUserInfo = await this.getFeishuTokenByApplications(code);

    // 同步信息
    const user: User = await this.userService.createOrUpdateByOAoth(
      feishuInfo,
    );

    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      feishuAccessToken: feishuInfo.accessToken,
      feishuUserId: feishuInfo.feishuUserId,
    };
  }

  async login(user: Payload) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async getFeishuTokenByApplications(code: string) {

    const data = await this.feishuService.getUserToken(code);

    const feishuInfo: GithubUserInfo = {
      accessToken: data.access_token,
      avatarBig: data.avatar_big,
      avatarMiddle: data.avatar_middle,
      avatarThumb: data.avatar_thumb,
      avatarUrl: data.avatar_url,
      email: data.email,
      enName: data.en_name,
      mobile: data.mobile,
      name: data.name,
      feishuUnionId: data.union_id,
      feishuUserId: data.user_id,
    };
    return feishuInfo;
  }
}
