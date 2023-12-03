import { CommonOutput } from 'src/common/dtos/output.dto';
import { Bookmark } from '../entities/bookmark.entity';

export class UsersBookmarksInput {}

export class UsersBookmarksOutput extends CommonOutput {
  bookmarks?: Bookmark[];
}
