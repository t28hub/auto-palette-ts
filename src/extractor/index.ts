import { Method, RGB } from '../types';

import { DBSCANExtractor } from './dbscan';
import { opacity } from './filter';
import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';
import { ColorFilter, type Extractor } from './types';

export { type Extractor } from './types';

/**
 * Type representing options of {@link DBSCANExtractor}.
 */
export type DBSCANOptions = {
  readonly minPoints: number;
  readonly threshold: number;
  readonly colorFilters: ColorFilter<RGB>[];
};

const defaultDBSCANOptions: DBSCANOptions = {
  minPoints: 9,
  threshold: 0.05,
  colorFilters: [opacity()],
};

/**
 * Create a new extractor using DBSCAN.
 *
 * @param options The options for the extractor.
 * @return The DBSCAN extractor.
 */
export function dbscan(options: Partial<DBSCANOptions> = {}): Extractor {
  const { minPoints, threshold, colorFilters } = { ...defaultDBSCANOptions, ...options };
  return new DBSCANExtractor(minPoints, threshold, colorFilters);
}

/**
 * Type representing options of {@link KmeansExtractor}.
 */
export type KmeansOptions = {
  readonly maxColors: number;
  readonly maxIterations: number;
  readonly tolerance: number;
  readonly colorFilters: ColorFilter<RGB>[];
};

const defaultKmeansOptions: KmeansOptions = {
  maxColors: 25,
  maxIterations: 10,
  tolerance: 0.25,
  colorFilters: [opacity()],
};

/**
 * Create a new extractor using kmeans.
 *
 * @param options The options for the extractor.
 * @return The kmeans extractor.
 */
export function kmeans(options: Partial<KmeansOptions> = {}): Extractor {
  const { maxColors, maxIterations, tolerance, colorFilters } = { ...defaultKmeansOptions, ...options };
  return new KmeansExtractor(maxColors, maxIterations, tolerance, colorFilters);
}

/**
 * Type representing options of {@link OctreeExtractor}.
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
 * Create a new extractor using Octree.
 *
 * @param options The options for the extractor.
 * @return The Octree extractor.
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
 * @see dbscan
 * @see kmeans
 * @see octree
 */
export function createExtractor(method: Method): Extractor {
  switch (method) {
    case 'dbscan':
      return dbscan();
    case 'kmeans':
      return kmeans();
    case 'octree':
      return octree();
    default:
      throw new TypeError(`Unrecognized method name: ${method}`);
  }
}
