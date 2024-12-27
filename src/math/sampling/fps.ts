import { assert } from '../../utils';
import type { DistanceMeasure } from '../distance';
import type { Point } from '../point';
import type { SamplingStrategy } from './strategy';

/**
 * FarthestPointSampling class represents a strategy for sampling a set of data points by selecting the farthest data points from the sampled data points.
 *
 * @typeParam P - The type of the point.
 */
export class FarthestPointSampling<P extends Point> implements SamplingStrategy<P> {
  /**
   * Create a new FarthestPointSampling instance.
   *
   * @param distanceMeasure - The distance measure to measure the distance between two points.
   */
  constructor(private readonly distanceMeasure: DistanceMeasure) {}

  /**
   * {@inheritDoc SamplingStrategy.sample}
   */
  sample(points: P[], n: number): Set<number> {
    assert(n > 0, `The number of data points to downsample(${n}) must be greater than 0`);
    if (n >= points.length) {
      return new Set(points.keys());
    }

    const sampled = new Set<number>();
    const distances = new Array(points.length);

    const initialIndex = this.findInitialIndex();
    assert(initialIndex >= 0, 'No data point can be selected as the initial data point');
    sampled.add(initialIndex);

    for (let i = 0; i < distances.length; i++) {
      distances[i] = this.distance(points, initialIndex, i);
    }

    while (sampled.size < n) {
      const farthestIndex = this.findFarthestIndex(distances, sampled);
      assert(farthestIndex >= 0, 'No data point can be selected as the farthest data point');

      sampled.add(farthestIndex);
      distances[farthestIndex] = 0.0;

      for (let i = 0; i < points.length; i++) {
        if (sampled.has(i)) {
          continue;
        }

        const previousDistance = distances[i];
        const currentDistance = this.distance(points, farthestIndex, i);
        distances[i] = Math.min(previousDistance, currentDistance);
      }
    }
    return sampled;
  }

  /**
   * Measure the distance between two data points.
   *
   * @param points - The data points.
   * @param i - The index of the 1st data point.
   * @param j - The index of the 2nd data point.
   * @returns The distance between the two data points.
   */
  protected distance(points: P[], i: number, j: number): number {
    return this.distanceMeasure(points[i], points[j]);
  }

  /**
   * Find the index of the initial data point.
   * @protected
   * @returns The index of the initial data point.
   */
  protected findInitialIndex(): number {
    return 0;
  }

  /**
   * Find the index of the farthest data point from the sampled data points.
   *
   * @param distances - The distances from the sampled data points.
   * @param sampled - The sampled data points.
   * @returns The index of the farthest data point. If no data point can be selected, returns -1.
   */
  private findFarthestIndex(distances: number[], sampled: Set<number>): number {
    let farthestIndex = -1;
    let farthestDistance = 0.0;
    for (let i = 0; i < distances.length; i++) {
      if (sampled.has(i)) {
        continue;
      }

      const distance = distances[i];
      if (distance > farthestDistance) {
        farthestDistance = distance;
        farthestIndex = i;
      }
    }
    return farthestIndex;
  }
}
