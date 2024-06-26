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
import { GeocodingInput, GeocodingOutput } from './dtos/geocoding.dto';
import { AutocompleteInput, AutocompleteOutput } from './dtos/autocomplete.dto';

@Injectable()
export class GoogleApiService {
  private readonly googleKey: string;
  private readonly nearbySearchBaseUrl: string;
  private readonly detailSearchBaseUrl: string;
  private readonly textSearchBaseUrl: string;
  private readonly reverseGeocodingUrl: string;
  private readonly autocompleteUrl: string;

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
    this.autocompleteUrl = this.configService.get('GOOGLE_AUTOCOMPLETE_URL');
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
    radius,
  }: TextSearchInput): Promise<TextSearchOutput> {
    try {
      const params = {
        radius: radius ? radius : '50000',
        query: keyword,
        key: this.googleKey,
        language: 'ko',
        type: isRestaurant === 'true' ? 'restaurant' : '',
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

      const localityArr =
        results[results.length - 5].formatted_address.split(' ');
      const isKorea = localityArr[0] === '대한민국' ? true : false;

      return { ok: true, localityArr, isKorea, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async geocoding({
    address,
    language,
  }: GeocodingInput): Promise<GeocodingOutput> {
    try {
      const params = {
        address,
        language,
        key: this.googleKey,
      };
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.reverseGeocodingUrl}${queryString}`;
      const response = await axios.get(requestUrl);
      const geocoding = response.data.results;

      return { ok: true, geocoding, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async autocomplete({
    input,
    language,
  }: AutocompleteInput): Promise<AutocompleteOutput> {
    try {
      const params = {
        input,
        language,
        key: this.googleKey,
      };
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${this.autocompleteUrl}${queryString}`;
      const response = await axios.get(requestUrl);
      const predictions = response.data.predictions;

      return { ok: true, predictions, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
