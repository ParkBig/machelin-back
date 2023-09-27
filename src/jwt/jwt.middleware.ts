import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

/**
 * 인증관련 1번째
 * 미들웨어를 통해 모든 요청(제외할수있지만)에 다음과 같은 검증과정을 거침
 */
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('token' in req.headers) {
      const token = req.headers['token'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { ok, user } = await this.userService.findById(decoded['id']);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
