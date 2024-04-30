import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { SignUpInput, SignUpOutput } from './dtos/sign-up.dto';
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
import { S3ServiceService } from 'src/s3-service/s3-service.service';
import {
  ModifyUserActivityZoneInput,
  ModifyUserActivityZoneOutput,
} from './dtos/modify-user-activity-zone.dto';
import {
  ModifyUserPreferFoodInput,
  ModifyUserPreferFoodOutput,
} from './dtos/modify-user-prefer-food.dto';
import {
  ModifyUserPreferRestaurantInput,
  ModifyUserPreferRestaurantOutput,
} from './dtos/modify-user-prefer-restaurant.dto';
import { UsersFollowsOutput } from './dtos/users-follows.dto';
import { UsersFollowersOutput } from './dtos/users-followers.dto';
import { TwilioService } from 'src/twilio/twilio.service';
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
import { GoogleApiService } from 'src/google-api/google-api.service';
import {
  UsersSubLocalityInput,
  UsersSubLocalityOutput,
} from './dtos/users-sub-locality.dto';
import {
  UsersFollowsIdInput,
  UsersFollowsIdOutput,
} from './dtos/users-follows-id.dto';
import { UserPostBlock } from './entities/userPostBlock.entity';
import { UserBlock } from './entities/userBlock.entity';
import { ToggleUserPostBlockInput } from './dtos/toggle-user-post-block.dto';
import { MyBlockedPostsOutput } from './dtos/my-blocked-posts.dto';
import { MyBlockedUsersOutput } from './dtos/my-blocked-users.dto';
import { Follow } from './entities/follow.entity';
import { Follower } from './entities/follower.entity';
import {
  ToggleUserBlockInput,
  ToggleUserBlockOutput,
} from './dtos/toggle-user-block.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly s3ServiceService: S3ServiceService,
    private readonly twilioService: TwilioService,
    private readonly jwtService: JwtService,
    private readonly googleApiService: GoogleApiService,
    @InjectRepository(Follow) private readonly follow: Repository<Follow>,
    @InjectRepository(Follower) private readonly follower: Repository<Follower>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserBlock)
    private readonly userBlock: Repository<UserBlock>,
    @InjectRepository(UserPostBlock)
    private readonly userPostBlock: Repository<UserPostBlock>,
  ) {}

  async signUp({
    loginId,
    password,
    nickname,
  }: SignUpInput): Promise<SignUpOutput> {
    try {
      const existingUser = await this.users.findOne({
        where: { loginId },
      });

      if (existingUser) {
        return { ok: false, msg: '이미 존재하는 아이디입니다.' };
      }

      await this.users.save(this.users.create({ loginId, password, nickname }));

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, msg: '서버가 잠시 아픈거 같아요...', error };
    }
  }

  async login({ loginId, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: { loginId },
      });
      if (!user) return { ok: false, msg: '존재하지 않는 유저입니다.' };

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) return { ok: false, msg: '잘못된 비밀번호입니다.' };

      const token = this.jwtService.sign(user.id);

      return { ok: true, msg: 'good work', token };
    } catch (error) {
      return { ok: false, msg: '서버가 잠시 아픈거 같아요...', error };
    }
  }

  async me(authUser: User): Promise<MeOutput> {
    try {
      if (!authUser) return { ok: false, authUser: null, msg: 'good work' };

      return { ok: true, authUser, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({
        where: { id },
      });
      return { ok: Boolean(user), user, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async modifyUserImage(
    authUser: User,
    image: Express.Multer.File,
  ): Promise<CommonOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      if (image) {
        const imageUrl = await this.s3ServiceService.uploadImage(image);
        user.pfp = imageUrl;
      } else {
        user.pfp = null;
      }

      await this.users.save(user);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async modifyUserNickname(
    authUser: User,
    { changeNickname }: ModifyUserNicknameInput,
  ): Promise<ModifyUserNicknameOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      user.nickname = changeNickname;

      await this.users.save(user);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async modifyUserActivityZone(
    authUser: User,
    { changeActivityZone }: ModifyUserActivityZoneInput,
  ): Promise<ModifyUserActivityZoneOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      user.activityZone = changeActivityZone;

      await this.users.save(user);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async modifyUserPreferFood(
    authUser: User,
    { type, changePreferFood }: ModifyUserPreferFoodInput,
  ): Promise<ModifyUserPreferFoodOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      if (type === 'add') {
        user.preferFoods.push(changePreferFood);
      } else {
        const newPreferFoods = user.preferFoods.filter(
          (preferFood) => preferFood !== changePreferFood,
        );
        user.preferFoods = newPreferFoods;
      }

      await this.users.save(user);

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async modifyUserPreferRestaurant(
    authUser: User,
    { changePreferRestaurant }: ModifyUserPreferRestaurantInput,
  ): Promise<ModifyUserPreferRestaurantOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      user.preferRestaurant = changePreferRestaurant;

      await this.users.save(user);

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async withdrawal(authUser: User): Promise<WithdrawalOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      await this.users.softDelete({ id: authUser.id });

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async findUsers(nickname: string): Promise<NicknameOutput> {
    try {
      const users = await this.users.find({
        where: { nickname: ILike(`%${nickname}%`) },
      });

      return { ok: true, users, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async toggleFriendState(
    authUser: User,
    { exploreUserId }: ToggleFriendStateInput,
  ): Promise<ToggleFriendStateOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }
      const exploreUser = await this.users.findOne({
        where: { id: exploreUserId },
      });
      if (!exploreUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const follows = await this.follow.findOne({
        where: { owner: { id: authUser.id } },
      });
      const followers = await this.follower.findOne({
        where: { owner: { id: exploreUserId } },
      });

      if (follows && followers) {
        await this.follow.remove(follows);
        await this.follower.remove(followers);
      } else {
        await this.follow.save(
          this.follow.create({ owner: authUser, follow: exploreUser }),
        );
        await this.follower.save(
          this.follower.create({ owner: exploreUser, follower: authUser }),
        );
      }

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async exploreUser(userId: number): Promise<ExploreUserOutput> {
    try {
      const user = await this.users.findOne({
        where: { id: userId },
      });
      if (!user) return { ok: false, msg: '잘못된 요청이네요' };

      return { ok: true, exploreUser: user, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersFollows(userId: number): Promise<UsersFollowsOutput> {
    try {
      const follows = await this.follow.find({
        where: { owner: { id: userId } },
      });

      return { ok: true, follows, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersFollowers(userId: number): Promise<UsersFollowersOutput> {
    try {
      const followers = await this.follower.find({
        where: { owner: { id: userId } },
      });

      return { ok: true, followers, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async sendSignUpVerification({
    phoneNumber,
  }: SendSignUpVerificationInput): Promise<SendSignUpVerificationOutput> {
    try {
      const userExist = await this.users.findOne({
        where: { mobile: phoneNumber },
      });

      if (userExist) {
        return { ok: false, msg: '이미 이 전화번호로 유저가 존재합니다' };
      }

      const { ok, msg } = await this.twilioService.sendVerification({
        phoneNumber,
      });

      return { ok, msg };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async checkSignUpVerification(
    authUser: User,
    checkSignupVerificationInput: CheckSignUpVerificationInput,
  ): Promise<CheckSignUpVerificationOutput> {
    try {
      const { ok, msg } = await this.twilioService.checkVerification(
        checkSignupVerificationInput,
      );

      if (!ok) {
        return { ok: false, msg };
      }

      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요' };
      }

      user.isVerified = true;
      user.mobile = checkSignupVerificationInput.phoneNumber;

      await this.users.save(user);

      return { ok, msg };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async sendFindMyIdVerification({
    phoneNumber,
  }: SendFindMyIdVerificationInput): Promise<SendFindMyIdVerificationOutput> {
    try {
      const user = await this.users.findOne({ where: { mobile: phoneNumber } });
      if (!user) {
        return { ok: false, msg: '해당 번호로 등록된 유저가 없습니다' };
      }

      const { ok, msg } = await this.twilioService.sendVerification({
        phoneNumber,
      });

      return { ok, msg };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async checkFindMyIdVerification(
    checkFindMyIdkVerificationInput: CheckFindMyIdkVerificationInput,
  ): Promise<CheckFindMyIdVerificationOutput> {
    try {
      const { ok, msg } = await this.twilioService.checkVerification(
        checkFindMyIdkVerificationInput,
      );

      if (!ok) {
        return { ok, msg };
      }

      const user = await this.users.findOne({
        where: { mobile: checkFindMyIdkVerificationInput.phoneNumber },
      });

      const token = this.jwtService.sign(user.id);

      return { ok: true, msg: 'good work', token };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersSubLocality({
    lat,
    lng,
  }: UsersSubLocalityInput): Promise<UsersSubLocalityOutput> {
    try {
      const { ok, msg, localityArr, isKorea } =
        await this.googleApiService.reverseGeocoding({
          lat,
          lng,
        });

      if (!ok) {
        return { ok, msg, localityArr: null, isKorea: null };
      }

      return { ok: true, msg: 'good work', localityArr, isKorea };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersFollowsPosts({
    userId,
  }: UsersFollowsIdInput): Promise<UsersFollowsIdOutput> {
    try {
      if (!userId) {
        return { followsIdArr: [] };
      }

      const follows = await this.follow.find({
        where: { owner: { id: userId } },
      });

      const followsIdArr = follows.map((user) => user.follow.id);

      return { followsIdArr };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async myBlockedPosts(authUser: User): Promise<MyBlockedPostsOutput> {
    try {
      if (!authUser) {
        return { ok: true, myBlockedPosts: [], msg: 'good work!' };
      }
      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: true, myBlockedPosts: [], msg: 'good work!' };
      }

      const myBlockedPosts = await this.userPostBlock.find({
        where: { owner: { id: authUser.id } },
      });

      return { ok: false, myBlockedPosts, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async toggleUserPostBlock(
    authUser: User,
    { postId }: ToggleUserPostBlockInput,
  ): Promise<CommonOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '로그인 후 이용가능합니다.' };
      }
      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '로그인 후 이용가능합니다.' };
      }

      const userPostBlock = await this.userPostBlock.findOne({
        where: { owner: { id: authUser.id }, blockedPostId: postId },
      });

      if (!userPostBlock) {
        await this.userPostBlock.save(
          this.userPostBlock.create({ blockedPostId: postId, owner: authUser }),
        );
      } else {
        await this.userPostBlock.remove(userPostBlock);
      }

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async myBlockedUsers(authUser: User): Promise<MyBlockedUsersOutput> {
    try {
      if (!authUser) {
        return {
          ok: false,
          myBlockedUsers: [],
          msg: '로그인 후 이용가능합니다.',
        };
      }
      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: true, myBlockedUsers: [] };
      }

      const myBlockedUsers = await this.userBlock.find({
        where: { owner: { id: authUser.id } },
      });
      console.log(myBlockedUsers, '@#@#');
      return { ok: false, myBlockedUsers, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...!' };
    }
  }

  async toggleUserBlock(
    authUser: User,
    { userId }: ToggleUserBlockInput,
  ): Promise<ToggleUserBlockOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '로그인 후 이용가능합니다.' };
      }
      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '로그인 후 이용가능합니다.' };
      }

      const userBlock = await this.userBlock.findOne({
        where: { owner: { id: authUser.id }, blockedUserId: userId },
      });
      if (!userBlock) {
        const isMyFollow = await this.follow.findOne({
          where: { owner: { id: authUser.id }, follow: { id: userId } },
        });
        if (isMyFollow) {
          const targetsFollower = await this.follower.findOne({
            where: { owner: { id: userId }, follower: { id: authUser.id } },
          });

          await this.follow.remove(isMyFollow);
          await this.follower.remove(targetsFollower);
        }

        const isMyFollower = await this.follower.findOne({
          where: { owner: { id: authUser.id }, follower: { id: userId } },
        });
        if (isMyFollower) {
          const targetFollow = await this.follow.findOne({
            where: { owner: { id: userId }, follow: { id: authUser.id } },
          });

          await this.follower.remove(isMyFollower);
          await this.follow.remove(targetFollow);
        }

        await this.userBlock.save(
          this.userBlock.create({ blockedUserId: userId, owner: authUser }),
        );
      } else {
        await this.userBlock.remove(userBlock);
      }

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
