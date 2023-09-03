import { Injectable, } from '@nestjs/common';
import { BusinessException, getGithubUser, } from '@app/common';
import { getGithubToken } from '@app/common';
import * as querystring from 'querystring'

@Injectable()
export class OAuthService {

  async getUserToken(code: string) {
    // const res: any = await getGithubToken({ code });
    const params = querystring.parse("access_token=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&scope=&token_type=bearer")
    // const params = querystring.parse(res)

    console.log('params===>?', params.access_token)
    return this.getOathUser(params.access_token as string);
  }

  async getOathUser(token: string) {
    return getGithubUser({ token })
  }
}
