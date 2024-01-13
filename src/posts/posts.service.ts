import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
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
import { UsersPostsInput, UsersPostsOutput } from './dtos/users-posts.dto';
import { UsersPostLikesDislikesOutput } from './dtos/users-post-likes-dislikes.dto';
import {
  UsersPostForMyMapInput,
  UsersPostForMyMapOutput,
} from './dtos/users-post-for-my-map.dto';
import { GoogleApiService } from 'src/google-api/google-api.service';
import {
  NeighborhoodPostsInput,
  NeighborhoodPostsOutput,
} from './dtos/neighborhood-posts.dto';
import { UsersService } from 'src/users/users.service';
import { DeletePostInput, DeletePostOutput } from './dtos/delete-posts.dto';
import {
  ModifyPostPublicStateInput,
  ModifyPostPublicStateOutput,
} from './dtos/modify-post-public-state.dto';
import { SearchPostsInput, SearchPostsOutput } from './dtos/search-posts.dto';
import { NoticePostsInput, NoticePostsOutput } from './dtos/notice-posts.dto';
import { AdPostsInput, AdPostsOutput } from './dtos/ad-posts.dto';
import { PostsLikedInput, PostsLikedOutput } from './dtos/posts-liked.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3ServiceService: S3ServiceService,
    private readonly googleApiService: GoogleApiService,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Like) private readonly likes: Repository<Like>,
    @InjectRepository(Dislike) private readonly dislikes: Repository<Dislike>,
    @InjectRepository(Report) private readonly reports: Repository<Report>,
  ) {}

  async neighborhoodPosts(
    authUser: User,
    { subLocality, page }: NeighborhoodPostsInput,
  ): Promise<NeighborhoodPostsOutput> {
    try {
      const postQuery: FindManyOptions<Post> = {
        where: [
          {
            isPublic: true,
            hasProblem: false,
            ownerSubLocality: subLocality,
          },
          {
            isPublic: true,
            hasProblem: false,
            restaurantSubLocality: subLocality,
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'allNotice',
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'localNotice',
          },
          // will add for ad
        ],
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 5,
        take: 5,
      };

      if (authUser) {
        const { followsIdArr } = await this.usersService.usersFollowsPosts({
          userId: authUser.id,
        });

        if (Array.isArray(postQuery['where'])) {
          postQuery['where'].push({
            isPublic: true,
            hasProblem: false,
            owner: { id: In(followsIdArr) },
          });
        }
      }

      const [neighborhoodPosts, total] = await this.posts.findAndCount(
        postQuery,
      );

      const nextPage = total > page * 5 ? Number(page) + 1 : null;

      return { ok: true, neighborhoodPosts, nextPage, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

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
        hasRestaurantTag,
        restaurantLat,
        restaurantLng,
        restaurantId,
        restaurantName,
        restaurantAddress,
        userLat,
        userLng,
      } = makePostInput;

      const hashtagArr = hashtags
        .match(/#[^\s,#]+/g)
        ?.map((tag) => tag.replace('#', '').trim());

      const { subLocality: ownerSubLocality } =
        await this.googleApiService.reverseGeocoding({
          lat: userLat,
          lng: userLng,
        });

      const postColumn = {
        images: imageUrls,
        contents,
        hashtags: hashtagArr,
        rating: +rating,
        isPublic: isPublic === 'true' ? true : false,
        owner: authUser,
        ownerSubLocality,
      };

      if (hasRestaurantTag) {
        const { subLocality: restaurantSubLocality } =
          await this.googleApiService.reverseGeocoding({
            lat: restaurantLat,
            lng: restaurantLng,
          });

        const postRestaurantInfoColumn = {
          restaurantId,
          restaurantName,
          restaurantAddress,
          hasRestaurantTag: hasRestaurantTag === 'true' ? true : false,
          restaurantLat: Number(restaurantLat),
          restaurantLng: Number(restaurantLng),
          restaurantSubLocality,
        };

        Object.assign(postColumn, postRestaurantInfoColumn);
      }

      await this.posts.save(this.posts.create(postColumn));

      return { ok: true, msg: 'good work!' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersPosts({
    targetId,
    myId,
    page,
  }: UsersPostsInput): Promise<UsersPostsOutput> {
    try {
      const isGetMyPost = targetId === myId;

      const postQuery: FindManyOptions<Post> = {
        where: { owner: { id: targetId } },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 10,
        take: 10,
      };

      if (!isGetMyPost) {
        postQuery['where']['isPublic'] = true;
      }

      const [posts, total] = await this.posts.findAndCount(postQuery);

      const nextPage = total > page * 10 ? Number(page) + 1 : null;

      return { ok: true, posts, msg: 'good work', nextPage };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async usersPostForMyMap({
    userId,
  }: UsersPostForMyMapInput): Promise<UsersPostForMyMapOutput> {
    try {
      const posts = await this.posts.find({
        where: { owner: { id: userId }, hasRestaurantTag: true },
        order: { rating: 'ASC' },
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

      if (post.report.length >= 9 && !post.hasProblem) {
        post.hasProblem = true;
        await this.posts.save(post);
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

  async findRestaurantPosts(restaurantId: string, page: number) {
    try {
      const query: FindManyOptions<Post> = {
        where: { restaurantId, isPublic: true },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 10,
        take: 10,
      };

      const [restaurantPosts, total] = await this.posts.findAndCount(query);

      const nextPage = total > page * 10 ? Number(page) + 1 : null;

      return { ok: true, restaurantPosts, nextPage, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async modifyPostPublicState(
    authUser: User,
    { id, isPublic }: ModifyPostPublicStateInput,
  ): Promise<ModifyPostPublicStateOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const post = await this.posts.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (!post) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      if (post.owner.id !== authUser.id) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      post.isPublic = isPublic;

      await this.posts.save(post);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async deletePost(
    authUser: User,
    { id }: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const post = await this.posts.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (!post) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      if (post.owner.id !== authUser.id) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      await this.posts.remove(post);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async searchPosts({
    keyword,
    page,
  }: SearchPostsInput): Promise<SearchPostsOutput> {
    try {
      const postQuery: FindManyOptions<Post> = {
        where: [
          {
            isPublic: true,
            hasProblem: false,
            postType: 'post',
            contents: ILike(`%${keyword}%`),
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'post',
            owner: {
              nickname: ILike(`%${keyword}%`),
            },
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'post',
            ownerSubLocality: ILike(`%${keyword}%`),
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'post',
            restaurantName: ILike(`%${keyword}%`),
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'post',
            hashtags: In([keyword]),
          },
        ],
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 5,
        take: 5,
      };

      const [searchPosts, total] = await this.posts.findAndCount(postQuery);

      const nextPage = total > page * 5 ? Number(page) + 1 : null;

      return { ok: true, searchPosts, nextPage, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async postsLiked(
    authUser: User,
    { page }: PostsLikedInput,
  ): Promise<PostsLikedOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const [postsLiked, total] = await this.posts.findAndCount({
        where: {
          likes: {
            owner: {
              id: authUser.id,
            },
          },
          isPublic: true,
          hasProblem: false,
        },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 5,
        take: 5,
      });

      const nextPage = total > page * 5 ? Number(page) + 1 : null;

      return { ok: true, msg: 'good work', postsLiked, nextPage };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async noticePosts({ page }: NoticePostsInput): Promise<NoticePostsOutput> {
    try {
      const postQuery: FindManyOptions<Post> = {
        where: [
          {
            isPublic: true,
            hasProblem: false,
            postType: 'allNotice',
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'localNotice',
          },
        ],
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 5,
        take: 5,
      };

      const [noticePosts, total] = await this.posts.findAndCount(postQuery);

      const nextPage = total > page * 5 ? Number(page) + 1 : null;

      return { ok: true, noticePosts, nextPage, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  /** will update! */
  async adPosts({ page }: AdPostsInput): Promise<AdPostsOutput> {
    try {
      const postQuery: FindManyOptions<Post> = {
        where: [
          {
            isPublic: true,
            hasProblem: false,
            postType: 'allAd',
          },
          {
            isPublic: true,
            hasProblem: false,
            postType: 'localAd',
          },
        ],
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 5,
        take: 5,
      };

      const [adPosts, total] = await this.posts.findAndCount(postQuery);

      const nextPage = total > page * 5 ? Number(page) + 1 : null;

      return { ok: true, adPosts, nextPage, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
