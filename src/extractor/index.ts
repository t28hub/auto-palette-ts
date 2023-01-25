import { DBSCAN, euclidean, Kmeans, Point5, squaredEuclidean } from '../math';
import { Method, RGB } from '../types';

import { Extractor } from './extractor';
import { type ColorFilter, opacity } from './filter';

export type { ColorFilter } from './filter';

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
  const dbscan = new DBSCAN<Point5>(minPoints, threshold, euclidean());
  return new Extractor(dbscan, colorFilters);
}

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
 * Create a new extractor using K-means.
 *
 * @param options The options for the extractor.
 * @return The kmeans extractor.
 */
export function kmeans(options: Partial<KmeansOptions> = {}): Extractor {
  const { maxColors, maxIterations, tolerance, colorFilters } = { ...defaultKmeansOptions, ...options };
  const kmeans = new Kmeans<Point5>(maxColors, maxIterations, tolerance, squaredEuclidean());
  return new Extractor(kmeans, colorFilters);
}

/**
 * Create a new extractor with options.
 *
 * @param method The color extraction method.
 * @return The created extractor.
 *
 * @see dbscan
 * @see kmeans
 */
export function createExtractor(method: Method): Extractor {
  switch (method) {
    case 'dbscan':
      return dbscan();
    case 'kmeans':
      return kmeans();
    default:
      throw new TypeError(`Unrecognized method name: ${method}`);
  }
}
