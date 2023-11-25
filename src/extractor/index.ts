import { RGBA } from '../color';
import { DBSCAN, Kmeans, Point5, squaredEuclidean } from '../math';

import { Extractor } from './extractor';
import { type ColorFilter, opacity } from './filter';

export type { ColorFilter } from './filter';

/**
 * Type representing DBSCAN options.
 */
export type DBSCANOptions = {
  readonly minPoints: number;
  readonly threshold: number;
  readonly colorFilters: ColorFilter<RGBA>[];
};

const DEFAULT_DBSCAN_OPTIONS: DBSCANOptions = {
  minPoints: 16,
  threshold: 0.0016,
  colorFilters: [opacity()],
};

/**
 * Create a new extractor using DBSCAN.
 *
 * @param options The options for the extractor.
 * @return The DBSCAN extractor.
 */
export function dbscanExtractor(options: Partial<DBSCANOptions> = {}): Extractor {
  const { minPoints, threshold, colorFilters } = { ...DEFAULT_DBSCAN_OPTIONS, ...options };
  const dbscan = new DBSCAN<Point5>(minPoints, threshold, squaredEuclidean);
  return new Extractor(dbscan, colorFilters);
}

/**
 * Type representing Kmeans options.
 */
export type KmeansOptions = {
  readonly maxColors: number;
  readonly maxIterations: number;
  readonly tolerance: number;
  readonly colorFilters: ColorFilter<RGBA>[];
};

const DEFAULT_KMEANS_OPTIONS: KmeansOptions = {
  maxColors: 25,
  maxIterations: 10,
  tolerance: 0.25,
  colorFilters: [opacity()],
};

/**
 * Create a new extractor using Kmeans.
 *
 * @param options The options for the extractor.
 * @return The Kmeans extractor.
 */
export function kmeansExtractor(options: Partial<KmeansOptions> = {}): Extractor {
  const { maxColors, maxIterations, tolerance, colorFilters } = { ...DEFAULT_KMEANS_OPTIONS, ...options };
  const kmeans = new Kmeans<Point5>(maxColors, maxIterations, tolerance, squaredEuclidean);
  return new Extractor(kmeans, colorFilters);
}
