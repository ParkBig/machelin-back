import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { MakePostInput, MakePostOutput } from './dtos/make-post.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { ReportPostInput, ReportPostOutput } from './dtos/report-post.dto';
import {
  TogglePostLikeDislikeInput,
  TogglePostLikeDislikeOutput,
} from './dtos/toggle-post-like-dislike.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UsersPostsInput, UsersPostsOutput } from './dtos/users-posts.dto';
import { UsersPostLikesDislikesOutput } from './dtos/users-post-likes-dislikes.dto';
import {
  UsersPostForMyMapInput,
  UsersPostForMyMapOutput,
} from './dtos/users-post-for-my-map.dto';
import {
  NeighborhoodPostsInput,
  NeighborhoodPostsOutput,
} from './dtos/neighborhood-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  hello() {
    return 'good work';
  }

  @Get('neighborhoodPosts')
  @Role(['Any'])
  neighborhoodPosts(
    @AuthUser() authUser: User,
    @Query() neighborhoodPostsInput: NeighborhoodPostsInput,
  ): Promise<NeighborhoodPostsOutput> {
    return this.postsService.neighborhoodPosts(
      authUser,
      neighborhoodPostsInput,
    );
  }

  @Get('usersPosts')
  usersPosts(
    @Query() usersPostsInput: UsersPostsInput,
  ): Promise<UsersPostsOutput> {
    return this.postsService.usersPosts(usersPostsInput);
  }

  @Get('usersPostForMyMap')
  usersPostForMyMap(
    @Query() usersPostForMyMapInput: UsersPostForMyMapInput,
  ): Promise<UsersPostForMyMapOutput> {
    return this.postsService.usersPostForMyMap(usersPostForMyMapInput);
  }

  @Get('usersPostLikesDislikes')
  usersPostLikesDislikes(
    @Query('userId') userId: number,
  ): Promise<UsersPostLikesDislikesOutput> {
    return this.postsService.usersPostLikesDislikes(userId);
  }

  @Post('makePost')
  @Role(['Any'])
  @UseInterceptors(FilesInterceptor('images'))
  makePost(
    @AuthUser() authUser: User,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() makePostInput: MakePostInput,
  ): Promise<MakePostOutput> {
    return this.postsService.makePost(authUser, images, makePostInput);
  }

  @Post('togglePostLikeDislike')
  @Role(['Any'])
  togglePostLikeDislike(
    @AuthUser() authUser: User,
    @Body() togglePostLikeDislikeInput: TogglePostLikeDislikeInput,
  ): Promise<TogglePostLikeDislikeOutput> {
    return this.postsService.togglePostLikeDislike(
      authUser,
      togglePostLikeDislikeInput,
    );
  }

  @Post('reportPost')
  @Role(['Any'])
  reportPost(
    @AuthUser() authUser: User,
    @Body() reportPostInput: ReportPostInput,
  ): Promise<ReportPostOutput> {
    return this.postsService.reportPost(authUser, reportPostInput);
  }
}
