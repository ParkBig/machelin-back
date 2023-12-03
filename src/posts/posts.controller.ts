import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { MakePostInput, MakePostOutput } from './dtos/make-post.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Response } from 'express';
import { ReportPostInput, ReportPostOutput } from './dtos/report-post.dto';
import {
  TogglePostLikeDislikeInput,
  TogglePostLikeDislikeOutput,
} from './dtos/toggle-post-like-dislike.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UsersPostsOutput } from './dtos/users-posts.dto';
import { UsersPostLikesDislikesOutput } from './dtos/users-post-likes-dislikes.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // get~
  @Get('usersPosts')
  usersPosts(@Query('userId') userId: number): Promise<UsersPostsOutput> {
    return this.postsService.usersPosts(userId);
  }

  @Get('usersPostLikesDislikes')
  usersPostLikesDislikes(
    @Query('userId') userId: number,
  ): Promise<UsersPostLikesDislikesOutput> {
    return this.postsService.usersPostLikesDislikes(userId);
  }

  // Post~
  @Post('makePost')
  @Role(['Any'])
  @UseInterceptors(FilesInterceptor('images'))
  makePost(
    @AuthUser() authUser: User,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() makePostInput: MakePostInput,
  ): Promise<MakePostOutput> {
    console.log(makePostInput);
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

  // 포스트 조회하기
  // 포스트 작성하기
  // 포스트 수정하기
}
