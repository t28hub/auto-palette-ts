import { assert } from '../../utils';
import type { DistanceMeasure } from '../distance';
import type { Point } from '../point';
import { FarthestPointSampling } from './fps';

/**
 * WeightedFarthestPointSampling class represents a strategy for sampling a set of data points by selecting the farthest data points from the sampled data points with weights.
 *
 * @typeParam P - The type of the point.
 * @see {@link FarthestPointSampling}
 */
export class WeightedFarthestPointSampling<P extends Point> extends FarthestPointSampling<P> {
  /**
   * Create a new WeightedFarthestPointSampling instance.
   *
   * @param weights - The weights of the data points.
   * @param distanceMeasure - The distance measure to measure the distance between two points.
   */
  constructor(
    private readonly weights: number[],
    distanceMeasure: DistanceMeasure,
  ) {
    super(distanceMeasure);
  }

  /**
   * {@inheritDoc SamplingStrategy.sample}
   */
  sample(points: P[], n: number): Set<number> {
    assert(n > 0, `The number of data points to downsample(${n}) must be greater than 0`);
    assert(points.length === this.weights.length, 'The number of data points and weights must be the same.');
    return super.sample(points, n);
  }

  /**
   * {@inheritDoc FarthestPointSampling.distance}
   */
  protected distance(points: P[], i: number, j: number): number {
    return super.distance(points, i, j) * this.weights[j];
  }

  /**
   * {@inheritDoc FarthestPointSampling.findInitialIndex}
   */
  protected findInitialIndex(): number {
    let maxWeight = 0;
    let initialIndex = -1;
    for (let i = 0; i < this.weights.length; i++) {
      const weight = this.weights[i];
      if (weight > maxWeight) {
        maxWeight = weight;
        initialIndex = i;
      }
    }
    return initialIndex;
  }
}
