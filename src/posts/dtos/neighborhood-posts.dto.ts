import { CommonOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

export class NeighborhoodPostsInput {
  subLocality: string;
  page: number;
}

export class NeighborhoodPostsOutput extends CommonOutput {
  neighborhoodPosts?: Post[];
  nextPage?: number | null;
}
