import { Body, Controller, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  NearbyRestaurantsInput,
  NearbyRestaurantsOutput,
} from './dtos/nearby-restaurants.dto';
import {
  DetailRestaurantInput,
  DetailRestaurantOutput,
} from './dtos/detail-restaurant.dto';

@Controller('restaurants')
export class restaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('nearbyRestaurants')
  nearbyRestaurants(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
    @Query('keyword') keyword: string,
  ): Promise<NearbyRestaurantsOutput> {
    return this.restaurantsService.nearbyRestaurants({
      lat,
      lng,
      radius,
      keyword,
    });
  }

  @Get('detailRestaurant')
  detailRestaurant(
    @Body() detailRestaurantInput: DetailRestaurantInput,
  ): Promise<DetailRestaurantOutput> {
    return this.restaurantsService.detailRestaurant(detailRestaurantInput);
  }

  @Get('test')
  test(@Query('test') test: string) {
    console.log(test);
    return 'hi';
  }
}
