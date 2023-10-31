import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { Bookmark, User } from './entities/user.entity';
import { SignUpInput, SignUpOutput } from './dtos/sign-up.dto';
import { UserModifyInput, UserModifyOutput } from './dtos/user-modify.dto';
import { WithdrawalOutput } from './dtos/withdrawal.dto';
import { DEFAULT_IMAGE } from 'src/const/default';
import { NicknameOutput } from './dtos/nickname.dto';
import {
  ToggleBookmarkStateInput,
  ToggleBookmarkStateOutput,
} from './dtos/toggle-bookmark-state';
import { ToggleFriendStateOutput } from './dtos/toggle-friend-state.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp({
    email,
    password,
    nickName,
  }: SignUpInput): Promise<SignUpOutput> {
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
      const user = await this.users.findOne({
        where: { email },
      });
      if (!user) return { ok: false, msg: '존재하지 않는 유저입니다.' };

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) return { ok: false, msg: '잘못된 비밀번호입니다.' };

      const token = this.jwtService.sign(user.id);

      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({
        where: { id },
        relations: ['posts'],
      });
      return { ok: Boolean(user), user };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async toggleBookmarkState(
    authUser: User,
    toggleBookmarkStateInput: ToggleBookmarkStateInput,
  ): Promise<ToggleBookmarkStateOutput> {
    try {
      const user = await this.users.findOne({
        where: { id: authUser.id },
      });
      if (!user) return { ok: false, msg: '잘못된 요청이네요' };

      const isBookmarkHasIndex = user.bookmarks.findIndex((bookmark) => {
        const parseBookmark: Bookmark = JSON.parse(bookmark);
        return parseBookmark.id === toggleBookmarkStateInput.id;
      });

      if (isBookmarkHasIndex !== -1) {
        user.bookmarks.splice(isBookmarkHasIndex, 1);
      } else {
        const jsonBookmarkInput = JSON.stringify(toggleBookmarkStateInput);
        user.bookmarks.push(jsonBookmarkInput);
      }

      await this.users.save(user);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async modifyUserInfo(
    authUser: User,
    userModifyInput: UserModifyInput,
  ): Promise<UserModifyOutput> {
    try {
      if (!authUser) {
        return { ok: false, error: '뭔가 잘못된 요청이네요!' };
      }
      const user = await this.users.findOne({ where: { id: authUser.id } });

      if (!user) {
        return { ok: false, error: '존재하지 않는 유저입니다.' };
      }
      const { type, content } = userModifyInput;

      if (type === 'pfp') {
        if (content === 'default') {
          user.pfp = DEFAULT_IMAGE;
        } else {
          user.pfp = content;
        }
      }
      if (type === 'nickName') {
        user.nickName = content;
      }
      if (type === 'email') {
        const hasDuplicateEmail = await this.users.find({
          where: { email: content },
        });
        if (hasDuplicateEmail.length) {
          return { ok: false, error: '중복된 이메일입니다.' };
        }
        user.email = content;
      }

      await this.users.save(user);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async withdrawal(authUser: User): Promise<WithdrawalOutput> {
    try {
      if (!authUser) {
        return { ok: false, error: '뭔가 잘못된 요청이네요!' };
      }

      await this.users.softDelete({ email: authUser.email, deletedAt: null });

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findUser(nickName: string): Promise<NicknameOutput> {
    try {
      const users = await this.users.find({
        where: { nickName: Like(`%${nickName}%`) },
        relations: ['posts'],
      });

      return { ok: true, users };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async toggleFriendState(
    authUser: User,
    toggleFriendStateInput: User,
  ): Promise<ToggleFriendStateOutput> {
    try {
      if (!authUser) {
        return { ok: false, error: '뭔가 잘못된 요청이네요!' };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      const followTargetUser = await this.users.findOne({
        where: { id: toggleFriendStateInput.id },
      });
      if (!user || !followTargetUser) {
        return { ok: false, msg: '잘못된 요청이네요' };
      }

      const isFollowSoIndex = user.follows.findIndex((follow) => {
        const parseFollow: User = JSON.parse(follow);
        return parseFollow.id === toggleFriendStateInput.id;
      });
      const isTargetUsersFollowerSoIndex = followTargetUser.followers.findIndex(
        (follower) => {
          const parseFollow: User = JSON.parse(follower);
          return parseFollow.id === authUser.id;
        },
      );

      if (isFollowSoIndex !== -1) {
        user.follows.splice(isFollowSoIndex, 1);
        followTargetUser.followers.splice(isTargetUsersFollowerSoIndex, 1);
      } else {
        const jsonFollow = JSON.stringify(toggleFriendStateInput);
        user.follows.push(jsonFollow);

        const jsonFollower = JSON.stringify(authUser);
        followTargetUser.followers.push(jsonFollower);
      }

      await this.users.save(user);
      await this.users.save(followTargetUser);

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
