import { createExtractor } from '../../extractor';
import { Algorithm, Color, ImageObject, PackedColor, Swatch } from '../../types';
import { filter } from '../filter';

/**
 * Extract colors from the given image.
 *
 * @param imageData The image data to be extracted.
 * @param algorithm The color extraction algorithm.
 * @param maxColors The number of max colors.
 * @return The array of feature color.
 * @throws {Error} if extraction is failed.
 */
export function extract(
  imageData: ImageObject<ArrayBuffer>,
  algorithm: Algorithm,
  maxColors: number,
): Swatch<PackedColor>[] {
  const { height, width, data } = imageData;
  const image: ImageObject<Uint8ClampedArray> = {
    height,
    width,
    data: new Uint8ClampedArray(data),
  };

  const swatches = createExtractor(algorithm).extract(image, maxColors * 3);
  return filter(swatches, maxColors)
    .sort((result1, result2): number => {
      return result2.population - result1.population;
    })
    .map((result: Swatch<Color>): Swatch<PackedColor> => {
      return {
        color: result.color.pack(),
        population: result.population,
      };
    });
}
