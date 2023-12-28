import { Injectable } from '@nestjs/common';
import { getGithubUser } from '@app/common';
import { getGithubToken } from '@app/common';
import * as querystring from 'querystring';

@Injectable()
export class OAuthService {
  async getUserToken(code: string) {
    const res: any = await getGithubToken({ code });
    const params = querystring.parse(res);

    return this.getOathUser(params.access_token as string);
  }

  async getOathUser(token: string) {
    return getGithubUser({ token });
  }
}
