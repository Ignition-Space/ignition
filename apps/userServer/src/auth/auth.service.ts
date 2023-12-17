import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { GithubUserInfo } from '../user/user.dto';
import { User } from '../user/user.mysql.entity';
import { UserService } from '../user/user.service';
import { OAuthService } from '../user/oauth.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private oAuthService: OAuthService,
  ) { }

  async validateFeishuUser(code: string): Promise<Payload> {
    const userInfo: GithubUserInfo = await this.getOAuthTokenByApplications(
      code,
    );

    // 同步信息
    const user: User = await this.userService.createOrUpdateByOAoth(userInfo);

    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }

  async login(user: Payload) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async getOAuthTokenByApplications(code: string) {
    const oauth = await this.oAuthService.getUserToken(code);
    return oauth;
  }
}
