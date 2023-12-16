export interface GooglePlace {
  name: string;
  formatted_address: string;
  place_id: string;
  geometry: {
    location: Location;
    viewport: Viewport;
  };
  photos: Photo[];

  address_components?: AddressComponent[];
  adr_address?: string;
  business_status?: string;
  curbside_pickup?: boolean;
  current_opening_hours?: OpeningHours;
  delivery?: boolean;
  dine_in?: boolean;
  editorial_summary?: PlaceEditorialSummary;
  formatted_phone_number?: string;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  opening_hours?: PlaceOpeningHours;
  plus_code?: PlusCode;
  price_level?: number;
  rating?: number;
  reservable?: boolean;
  reference?: string;
  reviews?: Review[];
  scope?: string;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_wine?: boolean;
  takeout?: boolean;
  types?: string[];
  url?: string;
  user_ratings_total?: number;
  utc_offset?: number;
  vicinity?: string;
  wheelchair_accessible_entrance?: boolean;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}
interface Location {
  lat: number;
  lng: number;
}
export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
interface OpeningHours {
  open_now: boolean;
  periods: OpeningHoursPeriod[];
  weekday_text: string[];
}
export interface OpeningHoursPeriod {
  open: { day: number; time: string };
  close: { day: number; time: string };
}
interface PlaceEditorialSummary {
  language?: string;
  overview?: string;
}
export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
  website?: string;
}
interface Viewport {
  northeast: Location;
  southwest: Location;
}
interface PlaceOpeningHours {
  open_now?: boolean;
  type?: string;
  weekday_text: string[];
}
