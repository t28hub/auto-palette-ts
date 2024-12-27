import type { Point } from '../point';

/**
 * SamplingStrategy interface represents a strategy for sampling a set of data points.
 *
 * @typeParam P - The type of the point.
 */
export interface SamplingStrategy<P extends Point> {
  /**
   * Sample the data points with the given number of data points.
   *
   * @param points - The data points to sample.
   * @param n - The number of data points to sample.
   * @returns The indices of the sampled data points.
   * @throws {RangeError} If the `n` is less than or equal to 0.
   */
  sample(points: P[], n: number): Set<number>;
}
