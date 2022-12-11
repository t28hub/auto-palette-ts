import { Color, PackedColor } from '../color';
import { ImageData } from '../types';

/**
 * Type representing the feature color of extraction.
 */
export type FeatureColor<T extends Color | PackedColor> = {
  /**
   * The feature color.
   */
  readonly color: T;

  /**
   * The population of the feature color.
   */
  readonly population: number;
};

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
  extract(imageData: ImageData<Uint8ClampedArray>, maxColors: number): FeatureColor<Color>[];
}
