import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
  Query,
  Req,
  Response,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTokenByApplications } from './auth.dto';
import { Public } from './constants';
import { PayloadUser } from '@app/common';
import { OAuthGuard } from './guards/oauth.guard';

@ApiTags('用户认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    summary: 'OAUTH 授权',
  })
  @Public()
  @UseGuards(OAuthGuard)
  @Get('/')
  async OAuth(
    @PayloadUser() user: Payload,
    @Res({ passthrough: true }) response,
  ) {
    const { access_token } = await this.authService.login(user);

    response.cookie('jwt', access_token, {
      path: '/',
      httpOnly: true,
      domain: '.ig-space.com',
    });

    return access_token;
  }

  @ApiOperation({
    summary: '登出',
    description: '服务器端清除 jwt cookies',
  })
  @Post('logout')
  async logout(@Res({ passthrough: true }) response) {
    response.setCookie('jwt', '');
    return {};
  }

  @ApiOperation({
    summary: '飞书 Auth2 授权登录',
    description:
      '通过 code 获取`access_token`https://open.feishu.cn/open-apis/authen/v1/index?app_id=cli_a2ed5e7be4f9500d&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauth',
  })
  @Public()
  @Get('/feishu/auth2')
  async getFeishuTokenByApplications(
    @PayloadUser() user: Payload,
    @Res({ passthrough: true }) response,
    @Query() query: GetTokenByApplications,
  ) {
    const { access_token } = await this.authService.login(user);

    response.setCookie('jwt', access_token, {
      path: '/',
    });

    return access_token;
  }

  @ApiOperation({
    summary: '解密 token 包含的信息',
    description: '解密 token 包含的信息',
  })
  @Get('/token/info')
  async getTokenInfo(@PayloadUser() user: Payload) {
    return user;
  }
}
