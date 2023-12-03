import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import {
  ToggleBookmarkInput,
  ToggleBookmarkOutput,
} from './dtos/toggle-bookmark.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersBookmarksOutput } from './dtos/users-bookmarks.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarksService: BookmarkService) {}

  // get~
  @Get('usersBookmarks')
  usersBookmarks(
    @Query('userId') userId: number,
  ): Promise<UsersBookmarksOutput> {
    return this.bookmarksService.usersBookmarks(userId);
  }

  // post~
  @Post('toggleBookmark')
  @Role(['Any'])
  toggleBookmark(
    @AuthUser() authUser: User,
    @Body() toggleBookmarkInput: ToggleBookmarkInput,
  ): Promise<ToggleBookmarkOutput> {
    return this.bookmarksService.toggleBookmark(authUser, toggleBookmarkInput);
  }
}
