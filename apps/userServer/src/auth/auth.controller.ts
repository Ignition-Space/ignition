import { Controller, Post, UseGuards, Res, Get, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from './constants';
import { PayloadUser } from '@app/common';
import { LocalGuard } from './guards/local.guard';
import { GithubGuard } from './guards/github.guard';
import { GoogleGuard } from './guards/google.guard';
import { UserLoginDto } from './auth.dto';

@ApiTags('用户认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    summary: '用户密码登录',
  })
  @Public()
  @UseGuards(LocalGuard)
  @Post('/login')
  async UserLogin(
    @PayloadUser() user: IPayloadUser,
    @Body() userLogin: UserLoginDto,
  ) {
    console.log(userLogin);
    const { access_token } = await this.authService.login(user);
    return access_token;
  }

  @ApiOperation({
    summary: '用户密码登录',
  })
  @Public()
  @UseGuards(LocalGuard)
  @Post('/login2')
  async UserLogin2(
    @PayloadUser() user: IPayloadUser,
    @Body() userLogin: UserLoginDto,
  ) {
    console.log(userLogin);
    const { access_token } = await this.authService.login(user);
    return access_token;
  }

  @ApiOperation({
    summary: 'Github OAUTH 授权',
  })
  @Public()
  @UseGuards(GithubGuard)
  @Get('/oauth/github')
  @ApiQuery({ name: 'code', description: '授权回调 code' })
  async OAuthGithub(
    @PayloadUser() user: IPayloadUser,
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
    summary: 'Google OAUTH 授权',
  })
  @Public()
  @UseGuards(GoogleGuard)
  @Get('/oauth/google')
  @ApiQuery({ name: 'code', description: '授权回调 code' })
  async OAuthGoogle(
    @PayloadUser() user: IPayloadUser,
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
      '通过 code 获取`access_token`https://open.feishu.cn/open-apis/authen/v1/index?app_id=07aac5b0e0a0dc5dfdcb&redirect_uri=http%3A%2F%2Fapi.ig-space.com%3A8080%2Fauth',
  })
  @Public()
  @Get('/feishu/auth2')
  async getFeishuTokenByApplications(
    @PayloadUser() user: IPayloadUser,
    @Res({ passthrough: true }) response,
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
  async getTokenInfo(@PayloadUser() user: IPayloadUser) {
    return user;
  }
}
