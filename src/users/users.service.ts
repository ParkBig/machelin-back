import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entitu';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dtos';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileOutput } from './dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    nickName,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const existingUser = await this.users.findOne({
        where: [{ email }, { nickName }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return { ok: false, msg: '이미 존재하는 이메일입니다.' };
        }
        if (existingUser.nickName === nickName) {
          return { ok: false, msg: '이미 존재하는 닉네임입니다.' };
        }
      }

      await this.users.save(this.users.create({ email, password, nickName }));

      return { ok: true, msg: 'complete save id' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return { ok: false, msg: '존재하지 않는 유저입니다.' };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, msg: '잘못된 비밀번호입니다.' };
      }

      const token = this.jwtService.sign(user.id);

      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id } });
      return { ok: Boolean(user), user };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
