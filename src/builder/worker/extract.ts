import { createExtractor } from '../../extractor';
import { Method, ImageObject, Swatch } from '../../types';
import { swatchFilter } from '../filter';
import { ExtractionResult } from '../types';

/**
 * Extract colors from the given image.
 *
 * @param imageData The image data to be extracted.
 * @param method The color extraction algorithm.
 * @param maxColors The number of max colors.
 * @return The array of feature color.
 * @throws {Error} if extraction is failed.
 */
export function extract(imageData: ImageObject<ArrayBuffer>, method: Method, maxColors: number): ExtractionResult[] {
  const { height, width, data } = imageData;
  const image: ImageObject<Uint8ClampedArray> = {
    height,
    width,
    data: new Uint8ClampedArray(data),
  };

  const swatches = createExtractor(method).extract(image, maxColors * 3);
  return swatchFilter()
    .apply(swatches, maxColors)
    .sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    })
    .map((result: Swatch): ExtractionResult => {
      return {
        color: result.color.pack(),
        population: result.population,
        coordinate: { ...result.coordinate },
      };
    });
}
