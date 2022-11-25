import { Color } from '../color';

export type Result = {
  readonly color: Color;
  readonly population: number;
};

export interface Extractor {
  extract(imageData: ImageData, maxColors: number): Result[];
}
