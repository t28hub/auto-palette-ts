import { Color } from '../color';

export interface Extractor {
  extract(imageData: ImageData, maxColors: number): Color[];
}
