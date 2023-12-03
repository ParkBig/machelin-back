import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BookmarkController } from './bookmarks.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bookmark])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarksModule {}
