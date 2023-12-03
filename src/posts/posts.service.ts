import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { MakePostInput, MakePostOutput } from './dtos/make-post.dto';
import { User } from 'src/users/entities/user.entity';
import { ReportPostInput, ReportPostOutput } from './dtos/report-post.dto';
import { Like } from './entities/like.entity';
import { Dislike } from './entities/dislike.entity';
import {
  TogglePostLikeDislikeInput,
  TogglePostLikeDislikeOutput,
} from './dtos/toggle-post-like-dislike.dto';
import { Report } from './entities/report.entity';
import { S3ServiceService } from 'src/s3-service/s3-service.service';
import { UsersPostsOutput } from './dtos/users-posts.dto';
import { UsersPostLikesDislikesOutput } from './dtos/users-post-likes-dislikes.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly s3ServiceService: S3ServiceService,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Like) private readonly likes: Repository<Like>,
    @InjectRepository(Dislike) private readonly dislikes: Repository<Dislike>,
    @InjectRepository(Report) private readonly reports: Repository<Report>,
  ) {}

  async makePost(
    authUser: User,
    images: Array<Express.Multer.File>,
    makePostInput: MakePostInput,
  ): Promise<MakePostOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const imageUrls = await this.s3ServiceService.uploadImages(images);

      const {
        contents,
        hashtags,
        rating,
        isPublic,
        restaurantId,
        restaurantName,
        restaurantAddress,
      } = makePostInput;
      const restaurant = { restaurantId, restaurantName, restaurantAddress };

      const hashtagArr = hashtags
        .match(/#[^\s,#]+/g)
        ?.map((tag) => tag.replace('#', '').trim());

      await this.posts.save(
        this.posts.create({
          images: imageUrls,
          contents,
          hashtags: hashtagArr,
          rating: +rating,
          isPublic: isPublic === 'true' ? true : false,
          owner: authUser,
          ...restaurant,
        }),
      );

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersPosts(userId: number): Promise<UsersPostsOutput> {
    try {
      const posts = await this.posts.find({
        where: { owner: { id: userId } },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });

      return { ok: true, posts, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersPostLikesDislikes(
    userId: number,
  ): Promise<UsersPostLikesDislikesOutput> {
    try {
      const usersLikes = await this.likes.find({
        where: { owner: { id: userId } },
        relations: ['post'],
      });
      const usersDislikes = await this.dislikes.find({
        where: { owner: { id: userId } },
        relations: ['post'],
      });

      return { ok: true, msg: 'good work', usersLikes, usersDislikes };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async togglePostLikeDislike(
    authUser: User,
    { postId, which }: TogglePostLikeDislikeInput,
  ): Promise<TogglePostLikeDislikeOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const post = await this.posts.findOne({
        where: { id: postId },
        relations: ['likes.owner', 'dislikes.owner'],
      });
      if (!post) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const foundLike = post.likes.find(
        (like) => like.owner.id === authUser.id,
      );
      const foundDislike = post.dislikes.find(
        (dislike) => dislike.owner.id === authUser.id,
      );

      if (which === 'like') {
        if (foundDislike) {
          await this.dislikes.remove(foundDislike);
        }

        if (!foundLike) {
          await this.likes.save(this.likes.create({ post, owner: authUser }));
        } else {
          await this.likes.remove(foundLike);
        }
      } else {
        if (foundLike) {
          await this.likes.remove(foundLike);
        }

        if (!foundDislike) {
          await this.dislikes.save(
            this.dislikes.create({ post, owner: authUser }),
          );
        } else {
          await this.dislikes.remove(foundDislike);
        }
      }

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async reportPost(
    authUser: User,
    { postId, report }: ReportPostInput,
  ): Promise<ReportPostOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const post = await this.posts.findOne({ where: { id: postId } });
      if (!post) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      await this.reports.save(
        this.reports.create({ report, post, owner: authUser }),
      );

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async countUsersPosts(userId: number): Promise<number> {
    const usersPosts = await this.posts.count({
      where: { owner: { id: userId } },
    });

    return usersPosts;
  }

  async findRestaurantPosts(restaurantId: string) {
    try {
      const restaurantPosts = await this.posts.find({
        where: { restaurantId },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });

      return { ok: true, restaurantPosts, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
