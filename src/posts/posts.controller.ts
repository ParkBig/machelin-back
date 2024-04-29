import {
  Body,
  Controller,
  Delete,
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
import { DeletePostInput, DeletePostOutput } from './dtos/delete-posts.dto';
import {
  ModifyPostPublicStateInput,
  ModifyPostPublicStateOutput,
} from './dtos/modify-post-public-state.dto';
import { SearchPostsInput, SearchPostsOutput } from './dtos/search-posts.dto';
import { NoticePostsInput, NoticePostsOutput } from './dtos/notice-posts.dto';
import { AdPostsInput, AdPostsOutput } from './dtos/ad-posts.dto';
import { PostsLikedInput, PostsLikedOutput } from './dtos/posts-liked.dto';
import { AllPostsInput } from './dtos/all-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('allPosts')
  @Role(['Any'])
  allPosts(@AuthUser() authUser: User, @Query() allPostsInput: AllPostsInput) {
    return this.postsService.allPosts(authUser, allPostsInput);
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

  @Get('searchPosts')
  searchPosts(
    @Query() searchPostsInput: SearchPostsInput,
  ): Promise<SearchPostsOutput> {
    return this.postsService.searchPosts(searchPostsInput);
  }

  @Get('postsLiked')
  @Role(['Any'])
  postsLiked(
    @AuthUser() authUser: User,
    @Query() postsLikedInput: PostsLikedInput,
  ): Promise<PostsLikedOutput> {
    return this.postsService.postsLiked(authUser, postsLikedInput);
  }

  @Get('noticePosts')
  noticePosts(
    @Query() noticePostsInput: NoticePostsInput,
  ): Promise<NoticePostsOutput> {
    return this.postsService.noticePosts(noticePostsInput);
  }

  @Get('adPosts')
  adPosts(@Query() adPostsInput: AdPostsInput): Promise<AdPostsOutput> {
    return this.postsService.adPosts(adPostsInput);
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

  @Post('modifyPostPublicState')
  @Role(['Any'])
  modifyPostPublicState(
    @AuthUser() authUser: User,
    @Body() modifyPostPublicStateInput: ModifyPostPublicStateInput,
  ): Promise<ModifyPostPublicStateOutput> {
    return this.postsService.modifyPostPublicState(
      authUser,
      modifyPostPublicStateInput,
    );
  }

  @Delete('deletePost')
  @Role(['Any'])
  deletePost(
    @AuthUser() authUser: User,
    @Query() deletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return this.postsService.deletePost(authUser, deletePostInput);
  }
}
