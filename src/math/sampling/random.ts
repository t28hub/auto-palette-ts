import { Point } from '../point';

import { assert } from '../../utils';
import { SamplingStrategy } from './strategy';

/**
 * RandomSampling implements the random sampling strategy.
 *
 * @typeParam P - The type of the point.
 */
export class RandomSampling<P extends Point> implements SamplingStrategy<P> {
  /**
   * {@inheritDoc SamplingStrategy.sample}
   */
  sample(points: P[], n: number): P[] {
    assert(n > 0, `The number of data points to downsample(${n}) must be greater than 0`);
    if (n >= points.length) {
      return [...points];
    }

    const sampled = new Set<P>();
    while (sampled.size < n) {
      const index = Math.floor(Math.random() * points.length);
      sampled.add(points[index]);
    }
    return Array.from(sampled);
  }
}
