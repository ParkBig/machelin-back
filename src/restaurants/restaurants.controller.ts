import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  NearbyRestaurantsInput,
  NearbyRestaurantsOutput,
} from './dtos/nearby-restaurants.dto';
import { RestaurantDetailOutput } from './dtos/restaurant-detail.dto';
import { RestaurantPostsOutput } from './dtos/restaurant-posts.dto';

@Controller('restaurants')
export class restaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('nearbyRestaurants')
  nearbyRestaurants(
    @Query() nearbyRestaurantsInput: NearbyRestaurantsInput,
  ): Promise<NearbyRestaurantsOutput> {
    return this.restaurantsService.nearbyRestaurants(nearbyRestaurantsInput);
  }

  @Get('restaurantDetail')
  restaurantDetail(
    @Query('restaurantId') restaurantId: string,
  ): Promise<RestaurantDetailOutput> {
    return this.restaurantsService.restaurantDetail(restaurantId);
  }

  @Get('restaurantPosts')
  restaurantPosts(
    @Query('restaurantId') restaurantId: string,
  ): Promise<RestaurantPostsOutput> {
    return this.restaurantsService.restaurantPosts(restaurantId);
  }
}
