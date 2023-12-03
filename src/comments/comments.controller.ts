import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { MakeCommentInput, MakeCommentOutput } from './dtos/make-comment.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  PostsCommentsInput,
  PostsCommentsOutput,
} from './dtos/posts-comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('postsComments')
  @Role(['Any'])
  postsComments(
    @Query() postsCommentsInput: PostsCommentsInput,
  ): Promise<PostsCommentsOutput> {
    return this.commentsService.postsComments(postsCommentsInput);
  }

  @Post('makeComment')
  @Role(['Any'])
  makeComment(
    @AuthUser() authUser: User,
    @Body() makeCommentInput: MakeCommentInput,
  ): Promise<MakeCommentOutput> {
    return this.commentsService.makeComment(authUser, makeCommentInput);
  }
}
