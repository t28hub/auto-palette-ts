import { SamplingStrategy } from './strategy';

/**
 * FarthestPointSampling implements the farthest point sampling strategy.
 *
 * @typeParam T - The type of the data points.
 */
export class FarthestPointSampling<T> implements SamplingStrategy<T> {
  /**
   * Create a new FarthestPointSampling instance.
   *
   * @param distanceFunction - The distance function to calculate the distance between two data points.
   */
  constructor(private readonly distanceFunction: (point1: T, point2: T) => number) {}

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

    const sampled = new Map<number, T>();
    const distances = new Array(points.length);

    const initialIndex = 0;
    const initialPoint = points[initialIndex];
    sampled.set(initialIndex, initialPoint);

    points.forEach((point, index) => {
      distances[index] = this.distanceFunction(point, initialPoint);
    });

    while (sampled.size < n) {
      const farthestIndex = this.findFarthestIndex(distances, sampled);
      // If no data point can be selected, stop sampling.
      if (farthestIndex < 0) {
        break;
      }

      const farthestPoint = points[farthestIndex];
      sampled.set(farthestIndex, farthestPoint);
      distances[farthestIndex] = 0.0;

      points.forEach((point, index) => {
        if (sampled.has(index)) {
          return;
        }

        const previousDistance = distances[index];
        const currentDistance = this.distanceFunction(farthestPoint, point);
        distances[index] = Math.min(previousDistance, currentDistance);
      });
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
  private findFarthestIndex(distances: number[], sampled: Map<number, T>): number {
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
