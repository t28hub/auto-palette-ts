import { Point } from '../point';

/**
 * SamplingStrategy interface represents a strategy for sampling a set of data points.
 *
 * @typeParam P - The type of the point.
 */
export interface SamplingStrategy<P extends Point> {
  /**
   * Downsample the data points according to the strategy.
   *
   * @param points - The set of data points to downsample.
   * @param n - The number of data points to downsample.
   * @returns The downsampled data points.
   * @throws {RangeError} If the `n` is less than or equal to 0.
   */
  sample(points: P[], n: number): P[];
}
