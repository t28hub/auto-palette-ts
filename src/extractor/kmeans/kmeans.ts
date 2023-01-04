import { DistanceMeasure, Point } from '../../math';

import { Cluster } from './cluster';
import { createInitializer, Initializer, InitializerName } from './initializer';

/**
 * Kmeans clustering algorithm implementation.
 */
export class Kmeans<P extends Point> {
  private readonly initializer: Initializer;

  /**
   * Create a new {@link Kmeans} instance
   *
   * @param initializationMethod The name of initialization method.
   * @param distanceMeasure The distance measure.
   * @param maxIterations The max iteration.
   * @param minDifference The min difference.
   * @throws {TypeError} if the maxIterations is not positive integer.
   */
  constructor(
    initializationMethod: InitializerName = 'kmeans++',
    private readonly distanceMeasure: DistanceMeasure,
    private readonly maxIterations: number,
    private readonly minDifference: number,
  ) {
    if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
      throw new TypeError(
        `The max iteration(${maxIterations}) is not positive integer`,
      );
    }
    if (!Number.isFinite(minDifference) || minDifference < 0) {
      throw new TypeError(
        `The min difference(${minDifference}) is not positive number`,
      );
    }
    this.initializer = createInitializer(initializationMethod);
  }

  /**
   * Classify the given points.
   *
   * @param points The points to be classified.
   * @param size The size of clusters.
   * @return The set of clusters.
   * @throws {TypeError} if the size is not positive integer.
   */
  classify(points: P[], size: number): Cluster<P>[] {
    if (!Number.isInteger(size) || size <= 0) {
      throw new TypeError(
        `The size(${size}) of cluster must be positive integer`,
      );
    }

    if (points.length <= size) {
      return points.map((point: P): Cluster<P> => {
        const cluster = new Cluster(point);
        cluster.insert(point);
        return cluster;
      });
    }

    const centroids = this.initializer.initialize<P>(points, size);
    const clusters = centroids.map((centroid: P): Cluster<P> => {
      return new Cluster(centroid, this.distanceMeasure);
    });
    for (let i = 0; i < this.maxIterations; i++) {
      const updated = this.iterate(clusters, points);
      if (!updated) {
        break;
      }
    }
    return clusters;
  }

  private iterate(clusters: Cluster<P>[], points: P[]): boolean {
    clusters.forEach((cluster: Cluster<P>) => cluster.clear());

    points.forEach((point: P) => {
      const nearestCluster = Kmeans.findNearestCluster(clusters, point);
      nearestCluster.insert(point);
    });

    let updated = true;
    clusters.forEach((cluster: Cluster<P>) => {
      const difference = cluster.updateCentroid();
      if (difference < this.minDifference) {
        updated = false;
      }
    }, 0.0);
    return updated;
  }

  private static findNearestCluster<P extends Point>(
    clusters: Cluster<P>[],
    point: P,
  ): Cluster<P> {
    let nearestCluster: Cluster<P> = clusters[0];
    let minDistance = nearestCluster.distanceTo(point);
    for (let i = 1; i < clusters.length; i++) {
      const cluster = clusters[i];
      const distance = cluster.distanceTo(point);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = cluster;
      }
    }
    return nearestCluster;
  }
}
