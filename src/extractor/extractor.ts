import { Color, PackedColor } from '../color';
import { ImageData } from '../types';

/**
 * Type representing the result of extraction.
 */
export type ExtractionResult<T extends Color | PackedColor> = {
  /**
   * The extracted color.
   */
  readonly color: T;

  /**
   * The population of the color.
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
  extract(imageData: ImageData, maxColors: number): ExtractionResult<Color>[];
}
