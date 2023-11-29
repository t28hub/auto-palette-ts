import { SamplingStrategy } from './strategy';

/**
 * RandomSampling implements the random sampling strategy.
 *
 * @typeParam T - The type of the data points.
 */
export class RandomSampling<T> implements SamplingStrategy<T> {
  /**
   * {@inheritDoc SamplingStrategy.sample}
   */
  sample(points: T[], n: number): T[] {
    if (n <= 0) {
      throw new RangeError(`The number of data points to downsample must be greater than 0: ${n}`);
    }

    if (n >= points.length) {
      return [...points];
    }

    const sampled = new Set<T>();
    while (sampled.size < n) {
      const index = Math.floor(Math.random() * points.length);
      sampled.add(points[index]);
    }
    return Array.from(sampled);
  }
}
