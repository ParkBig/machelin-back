import { CommonOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';
import { Post } from 'src/posts/entities/post.entity';

export class RestaurantPostsInput {
  @IsString()
  restaurantId: string;
}

export class RestaurantPostsOutput extends CommonOutput {
  machelinPosts?: Post[];
}
