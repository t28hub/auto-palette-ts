import { AlphaChannel, ImageObject, Swatch } from '../types';

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
  extract(imageData: ImageObject<Uint8ClampedArray>, maxColors: number): Swatch[];
}

/**
 * Interface of color filtering.
 *
 * @param T The type of color.
 */
export interface ColorFilter<T extends AlphaChannel> {
  /**
   * Check the color
   *
   * @param color The color to be checked.
   * @return true if the given color is included.
   */
  test(color: T): boolean;
}
