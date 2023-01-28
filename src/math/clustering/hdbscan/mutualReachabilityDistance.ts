import { DistanceFunction, Point, WeightFunction } from '../../types';

import { CoreDistance } from './coreDistance';

/**
 * Weight function implementation that computes the mutual reachability distance.
 *
 * @param P The type of point.
 */
export class MutualReachabilityDistance<P extends Point> implements WeightFunction {
  /**
   * Create a new MutualReachabilityDistance.
   *
   * @param points The all points.
   * @param coreDistance The core distance.
   * @param distanceFunction The distance function.
   */
  constructor(
    private readonly points: P[],
    private readonly coreDistance: CoreDistance,
    private readonly distanceFunction: DistanceFunction<P>,
  ) {}

  /**
   * Compute mutual reachability distance between u and v.
   *
   * @param u The source index of points.
   * @param v The target index of points.
   * @return The mutual reachability distance.
   * @throws {RangeError} if either or both indices u and v are invalid.
   */
  compute(u: number, v: number): number {
    this.checkIndex(u);
    this.checkIndex(v);

    const pointU = this.points[u];
    const pointV = this.points[v];
    const distance = this.distanceFunction.measure(pointU, pointV);
    return Math.max(distance, this.coreDistance.at(u), this.coreDistance.at(v));
  }

  private checkIndex(index: number) {
    if (index < 0 || index >= this.points.length) {
      throw new RangeError(`The given index is out of range [0, ${this.points.length}): ${index}`);
    }
  }
}
