import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  NearbySearchInput,
  NearbySearchOutput,
} from './dtos/nearby-search.dto';
import { TextSearchInput, TextSearchOutput } from './dtos/text-search.dto';
import {
  DetailSearchInput,
  DetailSearchOutput,
} from './dtos/detail-search.dto';
import {
  ReverseGeocodingInput,
  ReverseGeocodingOutput,
} from './dtos/reverse-geocoding.dto';

@Injectable()
export class GoogleApiService {
  private readonly googleKey: string;
  private readonly nearbySearchBaseUrl: string;
  private readonly detailSearchBaseUrl: string;
  private readonly textSearchBaseUrl: string;
  private readonly reverseGeocodingUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.googleKey = this.configService.get('GOOGLE_KEY');
    this.nearbySearchBaseUrl = this.configService.get(
      'GOOGLE_NEARBY_SEARCH_URL',
    );
    this.detailSearchBaseUrl = this.configService.get(
      'GOOGLE_DETAIL_SEARCH_URL',
    );
    this.textSearchBaseUrl = this.configService.get('GOOGLE_TEXT_SEARCH_URL');
    this.reverseGeocodingUrl = this.configService.get(
      'GOOGLE_REVERSE_GEOCODING_URL',
    );
  }

  async nearbySearch({
    lat,
    lng,
    radius,
    keyword,
    nextPageParams,
  }: NearbySearchInput): Promise<NearbySearchOutput> {
    try {
      const params = {
        location: `${lat},${lng}`,
        radius,
        keyword: keyword,
        key: this.googleKey,
        language: 'ko',
        type: keyword ? '' : 'restaurant',
      };
      const toNextPageParams = nextPageParams
        ? `&pagetoken=${nextPageParams}`
        : '';

      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.nearbySearchBaseUrl}${queryString}${toNextPageParams}`;
      const response = await axios.get(requestUrl);
      const restaurants = response.data.results;

      const next_page_token = response.data.next_page_token
        ? response.data.next_page_token
        : null;

      return { restaurants, next_page_token };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async textSearch({
    keyword,
    isRestaurant,
    nextPageParams,
  }: TextSearchInput): Promise<TextSearchOutput> {
    try {
      const params = {
        radius: '50000',
        query: keyword,
        key: this.googleKey,
        language: 'ko',
        type: isRestaurant === true ? 'restaurant' : '',
      };
      const toNextPageParams = nextPageParams
        ? `&pagetoken=${nextPageParams}`
        : '';
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.textSearchBaseUrl}${queryString}${toNextPageParams}`;
      const response = await axios.get(requestUrl);
      const restaurants = response.data.results;

      const next_page_token = response.data.next_page_token
        ? response.data.next_page_token
        : null;

      return { restaurants, next_page_token };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async detailSearch({
    restaurantId,
  }: DetailSearchInput): Promise<DetailSearchOutput> {
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

      return { restaurantDetail };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async reverseGeocoding({
    lat,
    lng,
  }: ReverseGeocodingInput): Promise<ReverseGeocodingOutput> {
    try {
      const params = {
        latlng: `${lat},${lng}`,
        key: this.googleKey,
        language: 'ko',
      };
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.reverseGeocodingUrl}${queryString}`;
      const response = await axios.get(requestUrl);
      const results = response.data.results;
      const subLocality = results[results.length - 4].formatted_address;

      return { subLocality };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
