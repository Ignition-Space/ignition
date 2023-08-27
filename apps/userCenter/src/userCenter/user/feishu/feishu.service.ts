import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import {
  getAppToken,
  getUserToken,
  refreshUserToken,
} from '@app/common';
import { Cache } from 'cache-manager';
import { GithubUserInfo, GetUserTokenDto } from './feishu.dto';
import { getSingleUserInfo, getUserListByDepartmentId, messages, FeishuHttpException, BusinessException, BUSINESS_ERROR_CODE } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeishuService {

  private APP_TOKEN_CACHE_KEY

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY')
  }

  async getAppToken() {
    let appToken: string;
    appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY);
    if (!appToken) {
      const response = await getAppToken();
      if (response.code === 0) {
        // token 有效期为 2 小时，在此期间调用该接口 token 不会改变。当 token 有效期小于 30 分的时候，
        // 再次请求获取 token 的时候，会生成一个新的 token，与此同时老的 token 依然有效。
        appToken = response.app_access_token;
        this.cacheManager.set(this.APP_TOKEN_CACHE_KEY, appToken);
      } else {
        throw new BusinessException('飞书调用异常')
      }
    }
    return appToken;
  }

  async setUserCacheToken(tokenInfo: any) {
    const {
      refresh_token,
      access_token,
      user_id,
      expires_in,
      refresh_expires_in,
    } = tokenInfo;

    // 缓存用户的 token
    await this.cacheManager.set(`feishu_user_token__${user_id}`, access_token);

    // 缓存用户的 fresh token
    await this.cacheManager.set(
      `feishu_refresh_token__${user_id}`,
      refresh_token,
    );
  }

  async sendMessage(receive_id_type, params) {
    const app_token = await this.getAppToken()
    return messages(receive_id_type, params, app_token as string)
  }

  async getCachedUserToken(userId: string) {
    let userToken: string = await this.cacheManager.get(
      `feishu_user_token__${userId}`,
    );
    // 如果 token 失效
    if (!userToken) {
      const refreshToken: string = await this.cacheManager.get(
        `feishu_refresh_token__${userId}`,
      );
      if (!refreshToken) {
        throw new BusinessException({
          code: BUSINESS_ERROR_CODE.TOKEN_INVALID,
          message: 'token 已失效',
        });
      }
      // 获取新的用户 token
      const usrTokenInfo = await this.getUserTokenByRefreshToken(refreshToken);
      // 更新缓存的用户 token
      await this.setUserCacheToken(usrTokenInfo);
      userToken = usrTokenInfo.access_token;
    }
    return userToken;
  }

  async getUserToken(code: string) {
    const app_token = await this.getAppToken()
    const dto: GetUserTokenDto = {
      code,
      app_token
    };
    const res: any = await getUserToken(dto);
    if (res.code !== 0) {
      throw new BusinessException(res.msg);
    }
    return res.data;
  }

  async getUserTokenByRefreshToken(refreshToken: string) {
    return await refreshUserToken({
      refreshToken,
      app_token: await this.getAppToken(),
    });
  }

  async getSingleUserInfo(feishuUserId: string) {
    const { code, data, msg } = await getSingleUserInfo(
      feishuUserId,
      await this.getAppToken(),
    ).catch((err) => {
      throw new FeishuHttpException(err);
    });
    if (code !== 0) {
      throw new BusinessException(msg);
    }
    return data;
  }

  async getUserListByDepartmentId() {
    const { code, data, msg } = await getUserListByDepartmentId(
      'c2d10',
      await this.getAppToken(),
    ).catch((err) => {
      throw new FeishuHttpException(err);
    });
    if (code !== 0) {
      throw new BusinessException(msg);
    }
    return data;
  }
}


