import { Module } from '@nestjs/common';
import { UserModule } from '@/userCenter/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { FeishuStrategy } from './strategies/feishu.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FeishuStrategy],
  exports: [AuthService],
})
export class AuthModule { }
