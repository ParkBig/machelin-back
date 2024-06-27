import { CommonOutput } from 'src/common/dtos/output.dto';

export class AutocompleteInput {
  input: string;
  language: string;
}

export class AutocompleteOutput extends CommonOutput {
  predictions?: Prediction[];
}

interface PredictionTerm {
  offset: number;
  value: string;
}

interface Prediction {
  description: string;
  place_id: string;
  terms: PredictionTerm[];
  types: string[];
}
