import { dbscanExtractor, hdbscanExtractor, kmeansExtractor } from '../extractor';
import { Quality, ImageObject, Swatch } from '../types';

import { ExtractionResult } from './types';

/**
 * Extract colors from the given image.
 *
 * @param imageData The image data to be extracted.
 * @param quality The color extraction quality.
 * @return The array of feature color.
 * @throws {Error} if extraction is failed.
 */
export function extract(imageData: ImageObject<ArrayBuffer>, quality: Quality): ExtractionResult[] {
  const { height, width, data } = imageData;
  const image: ImageObject<Uint8ClampedArray> = {
    height,
    width,
    data: new Uint8ClampedArray(data),
  };

  let extractor;
  switch (quality) {
    case 'low':
      extractor = kmeansExtractor();
      break;
    case 'middle':
      extractor = dbscanExtractor();
      break;
    case 'high':
      extractor = hdbscanExtractor();
      break;
  }
  return extractor.extract(image).map((swatch: Swatch): ExtractionResult => {
    return {
      color: swatch.color.pack(),
      population: swatch.population,
      coordinate: { ...swatch.coordinate },
    };
  });
}
