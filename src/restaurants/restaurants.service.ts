import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RestaurantDetailOutput } from './dtos/restaurant-detail.dto';
import { PostsService } from 'src/posts/posts.service';
import { RestaurantPostsOutput } from './dtos/restaurant-posts.dto';
import {
  NearbyRestaurantsSearchInput,
  NearbyRestaurantsSearchOutput,
} from './dtos/nearby-restaurants-search.dto';
import {
  RestaurantsTextSearchInput,
  RestaurantsTextSearchOutput,
} from './dtos/restaurants-text-search.dto';
import { RestaurantDetail } from './dtos/google-restaurant.interface';

@Injectable()
export class RestaurantsService {
  private readonly googleKey: string;
  private readonly nearbySearchBaseUrl: string;
  private readonly detailSearchBaseUrl: string;
  private readonly textSearchBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly postsService: PostsService,
  ) {
    this.googleKey = this.configService.get('GOOGLE_KEY');
    this.nearbySearchBaseUrl = this.configService.get(
      'GOOGLE_NEARBY_SEARCH_URL',
    );
    this.detailSearchBaseUrl = this.configService.get(
      'GOOGLE_DETAIL_SEARCH_URL',
    );
    this.textSearchBaseUrl = this.configService.get('GOOGLE_TEXT_SEARCH_URL');
  }

  async nearbyRestaurantsSearch({
    lat,
    lng,
    radius,
    keyword,
    nextPageParams,
  }: NearbyRestaurantsSearchInput): Promise<NearbyRestaurantsSearchOutput> {
    try {
      const params = {
        location: `${lat},${lng}`,
        radius,
        keyword: keyword,
        key: this.googleKey,
        language: 'ko',
      };
      const toNextPageParams = nextPageParams
        ? `&pagetoken=${nextPageParams}`
        : '';
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.nearbySearchBaseUrl}${queryString}${toNextPageParams}`;
      const response = await axios.get(requestUrl);
      const restaurants = response.data.results;

      const hasNextPageToken = response.data.next_page_token
        ? response.data.next_page_token
        : null;

      return {
        ok: true,
        msg: 'good work',
        restaurants: restaurants,
        next_page_token: hasNextPageToken,
      };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async restaurantsTextSearch({
    keyword,
  }: RestaurantsTextSearchInput): Promise<RestaurantsTextSearchOutput> {
    try {
      const requestUrl = `${this.textSearchBaseUrl}query=${keyword}&key=${this.googleKey}&language=ko`;
      const response = await axios.get(requestUrl);
      const result = response.data.results;

      return { ok: true, msg: 'good work', result };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async restaurantDetail(
    restaurantId: string,
  ): Promise<RestaurantDetailOutput> {
    try {
      const params = {
        place_id: restaurantId,
        key: this.googleKey,
        language: 'ko',
      };
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.detailSearchBaseUrl}${queryString}`;
      const response = await axios.get(requestUrl);
      const restaurantDetail = response.data.result;

      return {
        ok: true,
        restaurantDetail: restaurantDetail,
        msg: 'good work',
      };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async restaurantPosts(restaurantId: string): Promise<RestaurantPostsOutput> {
    try {
      const { restaurantPosts } = await this.postsService.findRestaurantPosts(
        restaurantId,
      );

      return { ok: true, msg: 'good work', machelinPosts: restaurantPosts };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
