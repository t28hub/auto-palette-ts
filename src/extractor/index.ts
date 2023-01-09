import { Method } from '../types';

import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';
import { type Extractor } from './types';

export { type Extractor } from './types';

/**
 * Create a new {@link Extractor} with options.
 *
 * @param algorithm The color extraction algorithm.
 * @return The created extractor.
 */
export function createExtractor(algorithm: Method): Extractor {
  switch (algorithm) {
    case 'kmeans':
      return new KmeansExtractor();
    case 'octree':
      return new OctreeExtractor();
    default:
      throw new TypeError(`Unrecognized algorithm(${algorithm})`);
  }
}
