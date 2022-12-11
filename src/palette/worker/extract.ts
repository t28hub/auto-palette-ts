import { Color, PackedColor } from '../../color';
import { createExtractor, FeatureColor } from '../../extractor';
import { ImageData } from '../../types';

/**
 * Extract colors from the given image.
 *
 * @param imageData The image data to be extracted.
 * @param maxColors The number of max colors.
 * @return The array of feature color.
 * @throws {Error} if extraction is failed.
 */
export function extract(imageData: ImageData<ArrayBuffer>, maxColors: number): FeatureColor<PackedColor>[] {
  const { height, width, data } = imageData;
  const image: ImageData<Uint8ClampedArray> = {
    height,
    width,
    data: new Uint8ClampedArray(data),
  };

  return createExtractor({ kind: 'octree', maxDepth: 8 })
    .extract(image, maxColors)
    .sort((result1, result2): number => {
      return result2.population - result1.population;
    })
    .map((result: FeatureColor<Color>): FeatureColor<PackedColor> => {
      return {
        color: result.color.toPackedColor(),
        population: result.population,
      };
    });
}
