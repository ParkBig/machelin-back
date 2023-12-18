import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

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
