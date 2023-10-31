import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpInput, SignUpOutput } from './dtos/sign-up.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { UserModifyInput, UserModifyOutput } from './dtos/user-modify.dto';
import { WithdrawalOutput } from './dtos/withdrawal.dto';
import { NicknameOutput } from './dtos/nickname.dto';
import {
  ToggleBookmarkStateInput,
  ToggleBookmarkStateOutput,
} from './dtos/toggle-bookmark-state';
import { ToggleFriendStateOutput } from './dtos/toggle-friend-state.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 정보 조회하기
  // 팔로우 하기, 취소하기

  @Get()
  isWork(@Res() res: Response) {
    return res.status(200).send('hello it`s good work!');
  }

  @Get('me')
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    if (!authUser) return { ok: false, authUser: null };
    return { ok: true, authUser };
  }

  @Get('findUser')
  @Role(['Any'])
  findUser(@Query('nickName') nickNameInput: string): Promise<NicknameOutput> {
    return this.usersService.findUser(nickNameInput);
  }

  @Post('signUp')
  signUp(@Body() signUpInput: SignUpInput): Promise<SignUpOutput> {
    return this.usersService.signUp(signUpInput);
  }

  @Post('login')
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Post('modifyUserInfo')
  @Role(['Any'])
  modifyUserInfo(
    @AuthUser() authUser: User,
    @Body() userModifyInput: UserModifyInput,
  ): Promise<UserModifyOutput> {
    return this.usersService.modifyUserInfo(authUser, userModifyInput);
  }

  @Post('toggleBookmarkState')
  @Role(['Any'])
  toggleBookmarkState(
    @AuthUser() authUser: User,
    @Body() toggleBookmarkStateInput: ToggleBookmarkStateInput,
  ): Promise<ToggleBookmarkStateOutput> {
    return this.usersService.toggleBookmarkState(
      authUser,
      toggleBookmarkStateInput,
    );
  }

  @Post('toggleFriendState')
  @Role(['Any'])
  toggleFriendState(
    @AuthUser() authUser: User,
    @Body() toggleFriendStateInput: User,
  ): Promise<ToggleFriendStateOutput> {
    return this.usersService.toggleFriendState(
      authUser,
      toggleFriendStateInput,
    );
  }

  @Delete('withdrawal')
  @Role(['Any'])
  withdrawal(@AuthUser() authUser: User): Promise<WithdrawalOutput> {
    return this.usersService.withdrawal(authUser);
  }
}
