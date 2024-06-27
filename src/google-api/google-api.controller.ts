import { Controller, Get, Query } from '@nestjs/common';
import { AutocompleteInput, AutocompleteOutput } from './dtos/autocomplete.dto';
import { GoogleApiService } from './google-api.service';
import { GeocodingInput, GeocodingOutput } from './dtos/geocoding.dto';

@Controller('googleApi')
export class GoogleApiController {
  constructor(private readonly googleApiService: GoogleApiService) {}

  @Get()
  hello() {
    return 'good work';
  }

  @Get('geocoding')
  geocoding(@Query() geocodingInput: GeocodingInput): Promise<GeocodingOutput> {
    return this.googleApiService.geocoding(geocodingInput);
  }

  @Get('autocomplete')
  autocomplete(
    @Query() autocompleteInput: AutocompleteInput,
  ): Promise<AutocompleteOutput> {
    return this.googleApiService.autocomplete(autocompleteInput);
  }
}
