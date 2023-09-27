import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

/**
 * 인증관련 2번째 변경물
 * jwt는 인증부분에서만 필요하니 모든요청(제외할수있지만)에 적용되는 미들웨어 말고 guard를이용 원하는 부분만 useGuard로 검증할수 있지만, 데코레이터를 만들기로 함.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];

    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
        if (!user) return false;
        request['user'] = user;
        if (roles.includes('Any')) return true;
        return roles.includes(user.role);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
