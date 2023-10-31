import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  NearbyRestaurantsInput,
  NearbyRestaurantsOutput,
} from './dtos/nearby-restaurants.dto';
import { ConfigService } from '@nestjs/config';
import {
  DetailRestaurantInput,
  DetailRestaurantOutput,
} from './dtos/detail-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async nearbyRestaurants({
    lat,
    lng,
    radius,
    keyword,
  }: NearbyRestaurantsInput): Promise<NearbyRestaurantsOutput> {
    console.log(lat, lng, radius, keyword);
    return { ok: true };
    try {
      const googleKey = this.config.get('GOOGLE_KEY');
      const url =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}&radius=${radius}&keyword=${keyword}&key=${googleKey}&language=ko`;
      const response = await this.httpService.axiosRef.get(url);
      const responseRestaurantsList = response.data.result;
      const restaurantList = await Promise.all(
        responseRestaurantsList.map(async (props) => ({
          ...props,
          photo: props.photos
            ? await this.restaurantPhotos(props.photos[0].photo_reference)
            : null,
        })),
      );
      return { ok: true, msg: 'good work', restaurants: restaurantList };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async restaurantPhotos(photoReference: string): Promise<string | null> {
    try {
      const googleKey = this.config.get('GOOGLE_KEY');
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${googleKey}`;
      const response = await this.httpService.axiosRef.get(url);

      return response.request.responseURL;
    } catch (error) {
      return null;
    }
  }

  async detailRestaurant({
    placeId,
  }: DetailRestaurantInput): Promise<DetailRestaurantOutput> {
    try {
      const googleKey = this.config.get('GOOGLE_KEY');
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleKey}&language=ko`;
      const response = await this.httpService.axiosRef.get(url);

      return response.data.result;
    } catch (error) {
      return { ok: false, error };
    }
  }
}
