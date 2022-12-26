import { Algorithm } from '../types';

import { type Extractor } from './extractor';
import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';

export { type Extractor } from './extractor';

/**
 * Create a new {@link Extractor} with options.
 *
 * @param algorithm The color extraction algorithm.
 * @return The created extractor.
 */
export function createExtractor(algorithm: Algorithm): Extractor {
  switch (algorithm) {
    case 'kmeans':
      return new KmeansExtractor();
    case 'octree':
      return new OctreeExtractor();
    default:
      throw new TypeError(`Unrecognized algorithm(${algorithm})`);
  }
}
