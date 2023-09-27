import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dtos';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entitu';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @Role(['Any'])
  me(@AuthUser() user: User) {
    return 'fuck';
  }

  @Post('createAccount')
  createAccount(
    @Body() createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Post('login')
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }
}
