import { CommonOutput } from 'src/common/dtos/output.dto';

export class ReverseGeocodingInput {
  lat: string;
  lng: string;
}

export class ReverseGeocodingOutput extends CommonOutput {
  localityArr?: string[];
  isKorea?: boolean;
}
