import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { SignUpInput, SignUpOutput } from './dtos/sign-up.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { WithdrawalOutput } from './dtos/withdrawal.dto';
import { NicknameOutput } from './dtos/nickname.dto';
import {
  ToggleFriendStateInput,
  ToggleFriendStateOutput,
} from './dtos/toggle-friend-state.dto';
import { MeOutput } from './dtos/me.dto';
import { ExploreUserOutput } from './dtos/explore-user.dto';
import {
  ModifyUserNicknameInput,
  ModifyUserNicknameOutput,
} from './dtos/modify-user-nickname.dto';
import { CommonOutput } from 'src/common/dtos/output.dto';
import {
  ModifyUserActivityZoneInput,
  ModifyUserActivityZoneOutput,
} from './dtos/modify-user-activity-zone.dto';
import {
  ModifyUserPreferFoodInput,
  ModifyUserPreferFoodOutput,
} from './dtos/modify-user-prefer-food.dto';
import { ModifyUserPreferRestaurantInput } from './dtos/modify-user-prefer-restaurant.dto';
import { UsersFollowsOutput } from './dtos/users-follows.dto';
import { UsersFollowersOutput } from './dtos/users-followers.dto';
import {
  CheckSignUpVerificationInput,
  CheckSignUpVerificationOutput,
} from './dtos/check-sign-up-verification.dto';
import {
  SendSignUpVerificationInput,
  SendSignUpVerificationOutput,
} from './dtos/send-sign-up-verification.dto';
import {
  SendFindMyIdVerificationInput,
  SendFindMyIdVerificationOutput,
} from './dtos/send-find-my-id-verification.dto';
import {
  CheckFindMyIdVerificationOutput,
  CheckFindMyIdkVerificationInput,
} from './dtos/check-find-my-id-verification.dto';
import {
  UsersSubLocalityInput,
  UsersSubLocalityOutput,
} from './dtos/users-sub-locality.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get~
  @Get()
  hello() {
    return 'good work';
  }

  @Get('me')
  @Role(['Any'])
  me(@AuthUser() authUser: User): Promise<MeOutput> {
    return this.usersService.me(authUser);
  }

  @Get('findUsers')
  findUsers(@Query('nickname') nicknameInput: string): Promise<NicknameOutput> {
    return this.usersService.findUsers(nicknameInput);
  }

  @Get('exploreUser')
  exploreUser(@Query('userId') userId: number): Promise<ExploreUserOutput> {
    return this.usersService.exploreUser(userId);
  }

  @Get('usersFollows')
  usersFollows(@Query('userId') userId: number): Promise<UsersFollowsOutput> {
    return this.usersService.usersFollows(userId);
  }

  @Get('usersFollowers')
  usersFollowers(
    @Query('userId') userId: number,
  ): Promise<UsersFollowersOutput> {
    return this.usersService.usersFollowers(userId);
  }

  @Get('usersSubLocality')
  usersSubLocality(
    @Query() usersSubLocalityInput: UsersSubLocalityInput,
  ): Promise<UsersSubLocalityOutput> {
    return this.usersService.usersSubLocality(usersSubLocalityInput);
  }

  // Post~
  @Post('signUp')
  signUp(@Body() signUpInput: SignUpInput): Promise<SignUpOutput> {
    return this.usersService.signUp(signUpInput);
  }

  @Post('login')
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Post('sendSignUpVerification')
  sendSignUpVerification(
    @Body() sendSignUpVerificationInput: SendSignUpVerificationInput,
  ): Promise<SendSignUpVerificationOutput> {
    return this.usersService.sendSignUpVerification(
      sendSignUpVerificationInput,
    );
  }

  @Post('checkSignUpVerification')
  @Role(['Any'])
  checkSignUpVerification(
    @AuthUser() authUser: User,
    @Body() checkSignUpVerificationInput: CheckSignUpVerificationInput,
  ): Promise<CheckSignUpVerificationOutput> {
    return this.usersService.checkSignUpVerification(
      authUser,
      checkSignUpVerificationInput,
    );
  }

  @Post('sendFindMyIdVerification')
  sendFindMyIdVerification(
    @Body() sendFindMyIdVerificationInput: SendFindMyIdVerificationInput,
  ): Promise<SendFindMyIdVerificationOutput> {
    return this.usersService.sendFindMyIdVerification(
      sendFindMyIdVerificationInput,
    );
  }

  @Post('checkFindMyIdVerification')
  checkFindMyIdVerification(
    @Body() checkFindMyIdkVerificationInput: CheckFindMyIdkVerificationInput,
  ): Promise<CheckFindMyIdVerificationOutput> {
    return this.usersService.checkFindMyIdVerification(
      checkFindMyIdkVerificationInput,
    );
  }

  @Post('modifyUserImage')
  @Role(['Any'])
  @UseInterceptors(FileInterceptor('image'))
  modifyUserImage(
    @AuthUser() authUser: User,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CommonOutput> {
    return this.usersService.modifyUserImage(authUser, image);
  }

  @Post('modifyUserNickname')
  @Role(['Any'])
  modifyUserNickname(
    @AuthUser() authUser: User,
    @Body() modifyUserNicknameInput: ModifyUserNicknameInput,
  ): Promise<ModifyUserNicknameOutput> {
    return this.usersService.modifyUserNickname(
      authUser,
      modifyUserNicknameInput,
    );
  }

  @Post('modifyUserActivityZone')
  @Role(['Any'])
  modifyUserActivityZone(
    @AuthUser() authUser: User,
    @Body() modifyUserActivityZoneInput: ModifyUserActivityZoneInput,
  ): Promise<ModifyUserActivityZoneOutput> {
    return this.usersService.modifyUserActivityZone(
      authUser,
      modifyUserActivityZoneInput,
    );
  }

  @Post('modifyUserPreferFood')
  @Role(['Any'])
  modifyUserPreferFood(
    @AuthUser() authUser: User,
    @Body() modifyUserPreferFoodInput: ModifyUserPreferFoodInput,
  ): Promise<ModifyUserPreferFoodOutput> {
    return this.usersService.modifyUserPreferFood(
      authUser,
      modifyUserPreferFoodInput,
    );
  }

  @Post('modifyUserPreferRestaurant')
  @Role(['Any'])
  modifyUserPreferRestaurant(
    @AuthUser() authUser: User,
    @Body() modifyUserPreferRestaurantInput: ModifyUserPreferRestaurantInput,
  ) {
    return this.usersService.modifyUserPreferRestaurant(
      authUser,
      modifyUserPreferRestaurantInput,
    );
  }

  @Post('toggleFriendState')
  @Role(['Any'])
  toggleFriendState(
    @AuthUser() authUser: User,
    @Body() toggleFriendStateInput: ToggleFriendStateInput,
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
