import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-custom';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req): Promise<IPayloadUser> {
    const user = await this.authService.validateLocalUser({ ...req.body });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
