import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { GithubUserInfo } from '../user/user.dto';
import { User } from '../user/user.mysql.entity';
import { UserService } from '../user/user.service';
import { OAuthService } from '../user/oauth.service';

import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private oAuthService: OAuthService,
  ) { }

  async validateLocalUser({ username, password }): Promise<IPayloadUser> {
    // 同步信息
    const user: User = await this.userService.findUserByLocal({
      username,
      password,
    });

    console.log('user==>', user);

    if (!user) return null;

    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }

  async validateGithubUser(code: string): Promise<IPayloadUser> {
    const userInfo: GithubUserInfo =
      await this.getOAuthTokenByApplications(code);

    // 同步信息
    const user: User = await this.userService.createOrUpdateByOAoth({
      ..._.omit(userInfo, ['id']),
      avatarUrl: userInfo.avatar_url,
    });

    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }


  async validateGoogleUser(code: string): Promise<IPayloadUser> {
    const userInfo = await this.getGoogleOAuthToken(code);

    // 同步信息
    const user: User = await this.userService.createOrUpdateByOAoth({
      ...userInfo,
      avatarUrl: userInfo.picture,
    });

    return {
      userId: user.id,
      username: user.name,
      name: user.name,
      email: user.email,
    };
  }

  async login(user: IPayloadUser) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async getOAuthTokenByApplications(code: string) {
    const oauth = await this.oAuthService.getGithubUserToken(code);
    return oauth;
  }

  async getGoogleOAuthToken(code: string) {
    const oauth = await this.oAuthService.getGoogleUserToken(code);
    return oauth;
  }
}
