import { Color, ImageObject, Swatch } from '../types';

/**
 * Interface of color extraction.
 */
export interface Extractor {
  /**
   * Extract colors from image data.
   *
   * @param imageData The image data.
   * @param maxColors The max colors.
   * @return The extracted results.
   */
  extract(imageData: ImageObject<Uint8ClampedArray>, maxColors: number): Swatch<Color>[];
}
