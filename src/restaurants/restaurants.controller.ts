import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  RestaurantDetailInput,
  RestaurantDetailOutput,
} from './dtos/restaurant-detail.dto';
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

@Controller('restaurants')
export class restaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('nearbyRestaurantsSearch')
  nearbyRestaurantsSearch(
    @Query() nearbyRestaurantsInput: NearbyRestaurantsSearchInput,
  ): Promise<NearbyRestaurantsSearchOutput> {
    return this.restaurantsService.nearbyRestaurantsSearch(
      nearbyRestaurantsInput,
    );
  }

  @Get('restaurantsTextSearch')
  restaurantsTextSearch(
    @Query() restaurantsTextSearchInput: RestaurantsTextSearchInput,
  ): Promise<RestaurantsTextSearchOutput> {
    return this.restaurantsService.restaurantsTextSearch(
      restaurantsTextSearchInput,
    );
  }

  @Get('restaurantDetail')
  restaurantDetail(
    @Query() restaurantDetailInput: RestaurantDetailInput,
  ): Promise<RestaurantDetailOutput> {
    return this.restaurantsService.restaurantDetail(restaurantDetailInput);
  }

  @Get('restaurantPosts')
  restaurantPosts(
    @Query() restaurantPostsInput: RestaurantPostsInput,
  ): Promise<RestaurantPostsOutput> {
    return this.restaurantsService.restaurantPosts(restaurantPostsInput);
  }
}
