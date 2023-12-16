import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from 'src/posts/entities/post.entity';

export class RestaurantPostsInput {
  restaurantId: string;
  page: number;
}

export class RestaurantPostsOutput extends CommonOutput {
  machelinPosts?: Post[];
  nextPage?: number | null;
}
