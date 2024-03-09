import type { DistanceMeasure } from '../distance';
import type { Point } from '../point';

import { assert } from '../../utils';
import type { SamplingStrategy } from './strategy';

/**
 * FarthestPointSampling implements the farthest point sampling strategy.
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
  sample(points: P[], n: number): P[] {
    assert(n > 0, `The number of data points to downsample(${n}) must be greater than 0`);
    if (n >= points.length) {
      return [...points];
    }

    const sampled = new Map<number, P>();
    const distances = new Array(points.length);

    const initialIndex = 0;
    const initialPoint = points[initialIndex];
    sampled.set(initialIndex, initialPoint);

    for (let i = 0; i < distances.length; i++) {
      distances[i] = this.distanceMeasure(points[i], initialPoint);
    }

    while (sampled.size < n) {
      const farthestIndex = this.findFarthestIndex(distances, sampled);
      assert(farthestIndex >= 0, 'No data point can be selected.');

      const farthestPoint = points[farthestIndex];
      sampled.set(farthestIndex, farthestPoint);
      distances[farthestIndex] = 0.0;

      for (let i = 0; i < points.length; i++) {
        if (sampled.has(i)) {
          continue;
        }

        const previousDistance = distances[i];
        const currentDistance = this.distanceMeasure(farthestPoint, points[i]);
        distances[i] = Math.min(previousDistance, currentDistance);
      }
    }
    return Array.from(sampled.values());
  }

  /**
   * Find the index of the farthest data point from the sampled data points.
   *
   * @param distances - The distances from the sampled data points.
   * @param sampled - The sampled data points.
   * @returns The index of the farthest data point. If no data point can be selected, returns -1.
   */
  private findFarthestIndex(distances: number[], sampled: Map<number, P>): number {
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
