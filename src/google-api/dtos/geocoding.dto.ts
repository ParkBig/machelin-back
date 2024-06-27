import { CommonOutput } from 'src/common/dtos/output.dto';

export class GeocodingInput {
  address: string;
  language: string;
}

export class GeocodingOutput extends CommonOutput {
  geocoding?: GeocodingResult;
}

interface GeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds?: Bounds;
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Bounds {
  northeast: Location;
  southwest: Location;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}
