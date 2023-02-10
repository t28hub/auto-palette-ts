import { dbscanExtractor, hdbscanExtractor, kmeansExtractor } from '../extractor';
import { Quality, Swatch } from '../types';

import { FeaturePoint } from './types';

/**
 * Extract feature points from the given image.
 *
 * @param imageData The image data to be extracted.
 * @param quality The color extraction quality.
 * @return The array of feature points.
 * @throws {Error} if extraction is failed.
 */
export function extract(imageData: ImageData, quality: Quality): FeaturePoint[] {
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
  return extractor.extract(imageData).map((swatch: Swatch): FeaturePoint => {
    return {
      color: swatch.color.pack(),
      population: swatch.population,
      coordinate: { ...swatch.coordinate },
    };
  });
}
