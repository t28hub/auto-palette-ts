import { Method, RGB } from '../types';

import { opacity } from './filter';
import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';
import { ColorFilter, type Extractor } from './types';

export { type Extractor } from './types';

/**
 * Type representing options of KmeansExtractor.
 */
export type KmeansOptions = {
  readonly maxIterations: number;
  readonly minDifference: number;
  readonly colorFilters: ColorFilter<RGB>[];
};

const defaultKmeansOptions: KmeansOptions = {
  maxIterations: 10,
  minDifference: 0.25,
  colorFilters: [opacity()],
};

/**
 * Create a new extractor using kmeans.
 *
 * @param options The options for the extractor.
 * @return The kmeans extractor.
 *
 * @see octree
 * @see createExtractor
 */
export function kmeans(options: Partial<KmeansOptions> = {}): Extractor {
  const { maxIterations, minDifference, colorFilters } = { ...defaultKmeansOptions, ...options };
  return new KmeansExtractor(maxIterations, minDifference, colorFilters);
}

/**
 * Type representing options of OctreeExtractor.
 */
export type OctreeOptions = {
  readonly maxDepth: number;
  readonly colorFilters: ColorFilter<RGB>[];
};

const defaultOctreeOptions: OctreeOptions = {
  maxDepth: 5,
  colorFilters: [opacity()],
};

/**
 * Create a new extractor using octree.
 *
 * @param options The options for the extractor.
 * @return The octree extractor.
 *
 * @see kmeans
 * @see createExtractor
 */
export function octree(options: Partial<OctreeOptions> = {}): Extractor {
  const { maxDepth, colorFilters } = { ...defaultOctreeOptions, ...options };
  return new OctreeExtractor(maxDepth, colorFilters);
}

/**
 * Create a new extractor with options.
 *
 * @param method The color extraction method.
 * @return The created extractor.
 *
 * @see kmeans
 * @see octree
 */
export function createExtractor(method: Method): Extractor {
  switch (method) {
    case 'kmeans':
      return kmeans();
    case 'octree':
      return octree();
    default:
      throw new TypeError(`Unrecognized method(${method})`);
  }
}
