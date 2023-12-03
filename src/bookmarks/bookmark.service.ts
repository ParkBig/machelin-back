import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  ToggleBookmarkInput,
  ToggleBookmarkOutput,
} from './dtos/toggle-bookmark.dto';
import { UsersBookmarksOutput } from './dtos/users-bookmarks.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarks: Repository<Bookmark>,
  ) {}

  async usersBookmarks(userId: number): Promise<UsersBookmarksOutput> {
    try {
      const bookmarks = await this.bookmarks.find({
        where: { owner: { id: userId } },
        order: { createdAt: 'DESC' },
      });

      return { ok: true, bookmarks, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async toggleBookmark(
    authUser: User,
    toggleBookmarkInput: ToggleBookmarkInput,
  ): Promise<ToggleBookmarkOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const bookmark = await this.bookmarks.findOne({
        where: {
          restaurantId: toggleBookmarkInput.restaurantId,
          owner: {
            id: authUser.id,
          },
        },
      });

      if (bookmark) {
        await this.bookmarks.remove(bookmark);
      } else {
        await this.bookmarks.save(
          this.bookmarks.create({ ...toggleBookmarkInput, owner: authUser }),
        );
      }

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
