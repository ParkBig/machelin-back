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
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('restaurants')
export class restaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  hello() {
    return 'good work';
  }

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
  @Role(['Any'])
  restaurantPosts(
    @AuthUser() authUser: User,
    @Query() restaurantPostsInput: RestaurantPostsInput,
  ): Promise<RestaurantPostsOutput> {
    return this.restaurantsService.restaurantPosts(
      authUser,
      restaurantPostsInput,
    );
  }
}
