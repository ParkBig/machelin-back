import { Injectable } from '@nestjs/common';
import {
  RestaurantDetailInput,
  RestaurantDetailOutput,
} from './dtos/restaurant-detail.dto';
import { PostsService } from 'src/posts/posts.service';
import {
  RestaurantPostsInput,
  RestaurantPostsOutput,
} from './dtos/restaurant-posts.dto';
import {
  NearbyRestaurantsSearchInput,
  NearbyRestaurantsSearchOutput,
} from './dtos/nearby-restaurants-search.dto';
import {
  RestaurantsTextSearchInput,
  RestaurantsTextSearchOutput,
} from './dtos/restaurants-text-search.dto';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly postsService: PostsService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  async nearbyRestaurantsSearch(
    nearbyRestaurantsSearchInput: NearbyRestaurantsSearchInput,
  ): Promise<NearbyRestaurantsSearchOutput> {
    try {
      const { restaurants, next_page_token } =
        await this.googleApiService.nearbySearch(nearbyRestaurantsSearchInput);

      return {
        ok: true,
        msg: 'good work',
        restaurants,
        next_page_token,
      };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async restaurantsTextSearch(
    restaurantsTextSearchInput: RestaurantsTextSearchInput,
  ): Promise<RestaurantsTextSearchOutput> {
    try {
      const { restaurants, next_page_token } =
        await this.googleApiService.textSearch(restaurantsTextSearchInput);

      return {
        ok: true,
        msg: 'good work',
        restaurants,
        next_page_token,
      };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async restaurantDetail(
    restaurantDetailInput: RestaurantDetailInput,
  ): Promise<RestaurantDetailOutput> {
    try {
      const { restaurantDetail } = await this.googleApiService.detailSearch(
        restaurantDetailInput,
      );

      const { rating, total } =
        await this.postsService.restaurantPostsRatingNTotal(
          restaurantDetailInput.restaurantId,
        );

      return {
        ok: true,
        restaurantDetail,
        machelinRating: rating,
        machelinTotal: total,
        msg: 'good work',
      };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async restaurantPosts(
    authUser: User,
    { restaurantId, page }: RestaurantPostsInput,
  ): Promise<RestaurantPostsOutput> {
    try {
      const { restaurantPosts, nextPage } =
        await this.postsService.findRestaurantPosts(
          authUser,
          restaurantId,
          page,
        );

      return {
        ok: true,
        msg: 'good work',
        machelinPosts: restaurantPosts,
        nextPage,
      };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
