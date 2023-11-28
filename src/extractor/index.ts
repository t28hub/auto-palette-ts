import { DBSCAN, Kmeans, Point5, squaredEuclidean } from '../math';

import { Extractor } from './extractor';
import { ColorFilterFunction } from './filter';

export { alphaFilter, type ColorFilterFunction, luminanceFilter } from './filter';

/**
 * Options for the DBSCAN color extractor.
 */
export type DBSCANOptions = {
  /**
   * The minimum number of points required to form a dense region.
   */
  readonly minPoints: number;

  /**
   * The maximum distance between two points for them to be considered as in the same dense region.
   */
  readonly threshold: number;

  /**
   * The color filters to apply.
   */
  readonly filters: ColorFilterFunction[];
};

// Default options for the DBSCAN color extractor.
const DEFAULT_DBSCAN_OPTIONS: DBSCANOptions = {
  minPoints: 16, // 4 * 4
  threshold: 0.0016, // 0.04 * 0.04
  filters: [],
};

/**
 * Create a new color extractor using DBSCAN algorithm.
 *
 * @param options - The options for the DBSCAN color extractor.
 * @returns The color extractor.
 */
export function dbscanExtractor(options: Partial<DBSCANOptions> = {}): Extractor {
  const { minPoints, threshold, filters } = { ...DEFAULT_DBSCAN_OPTIONS, ...options };
  const dbscan = new DBSCAN<Point5>(minPoints, threshold, squaredEuclidean);
  return new Extractor(dbscan, filters);
}

/**
 * Options for the Kmeans color extractor.
 */
export type KmeansOptions = {
  /**
   * The maximum number of colors to extract.
   */
  readonly maxColors: number;

  /**
   * The maximum number of iterations.
   */
  readonly maxIterations: number;

  /**
   * The tolerance for convergence.
   */
  readonly tolerance: number;

  /**
   * The color filters to apply.
   */
  readonly filters: ColorFilterFunction[];
};

// Default options for the Kmeans color extractor.
const DEFAULT_KMEANS_OPTIONS: KmeansOptions = {
  maxColors: 32,
  maxIterations: 10,
  tolerance: 0.25,
  filters: [],
};

/**
 * Create a new color extractor using K-means algorithm.
 *
 * @param options - The options for the K-means color extractor.
 * @returns The color extractor.
 */
export function kmeansExtractor(options: Partial<KmeansOptions> = {}): Extractor {
  const { maxColors, maxIterations, tolerance, filters } = { ...DEFAULT_KMEANS_OPTIONS, ...options };
  const kmeans = new Kmeans<Point5>(maxColors, maxIterations, tolerance, squaredEuclidean);
  return new Extractor(kmeans, filters);
}
