import { createExtractor } from '../../extractor';
import { Method, ImageObject, Swatch } from '../../types';
import { ExtractionResult } from '../types';

/**
 * Extract colors from the given image.
 *
 * @param imageData The image data to be extracted.
 * @param method The color extraction algorithm.
 * @return The array of feature color.
 * @throws {Error} if extraction is failed.
 */
export function extract(imageData: ImageObject<ArrayBuffer>, method: Method): ExtractionResult[] {
  const { height, width, data } = imageData;
  const image: ImageObject<Uint8ClampedArray> = {
    height,
    width,
    data: new Uint8ClampedArray(data),
  };

  const extractor = createExtractor(method);
  return extractor.extract(image).map((swatch: Swatch): ExtractionResult => {
    return {
      color: swatch.color.pack(),
      population: swatch.population,
      coordinate: { ...swatch.coordinate },
    };
  });
}
