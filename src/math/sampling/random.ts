import type { Point } from '../point';

import { assert } from '../../utils';
import type { SamplingStrategy } from './strategy';

/**
 * RandomSampling implements the random sampling strategy.
 *
 * @typeParam P - The type of the point.
 */
export class RandomSampling<P extends Point> implements SamplingStrategy<P> {
  /**
   * {@inheritDoc SamplingStrategy.sample}
   */
  sample(points: P[], n: number): Set<number> {
    assert(n > 0, `The number of data points to downsample(${n}) must be greater than 0`);
    if (n >= points.length) {
      return new Set(points.keys());
    }

    const sampled = new Set<number>();
    while (sampled.size < n) {
      const index = Math.floor(Math.random() * points.length);
      if (sampled.has(index)) {
        continue;
      }
      sampled.add(index);
    }
    return sampled;
  }
}
