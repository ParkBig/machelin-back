export type responseRestaurant = {
  business_status: string;
  geometry: {
    location: Location;
    viewport: Viewport;
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Photo[];
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  price_level?: number;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
};
interface Viewport {
  northeast: Location;
  southwest: Location;
}
interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface DetailRestaurant {
  address_components: AddressComponent[];
  adr_address: string;
  business_status: string;
  current_opening_hours: OpeningHours;
  dine_in: boolean;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: {
    location: { lat: number; lng: number };
    viewport: { northeast: any; southwest: any };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  international_phone_number: string;
  name: string;
  opening_hours: OpeningHours;
  photos: Photo[];
  place_id: string;
  plus_code: PlusCode;
  rating: number;
  reference: string;
  reservable: boolean;
  reviews: Review[];
  serves_beer: boolean;
  serves_brunch: boolean;
  serves_dinner: boolean;
  serves_lunch: boolean;
  serves_wine: boolean;
  types: string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
  website: string;
}
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
interface OpeningHoursPeriod {
  open: { day: number; time: string };
  close: { day: number; time: string };
}
interface OpeningHours {
  open_now: boolean;
  periods: OpeningHoursPeriod[];
  weekday_text: string[];
}
interface PlusCode {
  compound_code: string;
  global_code: string;
}
interface Review {
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
}
