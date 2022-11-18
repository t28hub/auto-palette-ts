import { DistanceMeasure, EuclideanDistance, Point3 } from '../math';

import { Cluster } from './cluster';
import { createInitializer, Initializer, InitializerName } from './initializer';

const DEFAULT_MAX_ITERATIONS = 10;
const DEFAULT_MIN_DIFFERENCE = 0.3 * 0.3;

/**
 * Kmeans clustering algorithm implementation.
 */
export class Kmeans {
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
    private readonly distanceMeasure: DistanceMeasure = EuclideanDistance,
    private readonly maxIterations: number = DEFAULT_MAX_ITERATIONS,
    private readonly minDifference: number = DEFAULT_MIN_DIFFERENCE,
  ) {
    if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
      throw new TypeError(`The max iteration(${maxIterations}) is not positive integer`);
    }
    if (!Number.isFinite(minDifference) || minDifference < 0) {
      throw new TypeError(`The min difference(${minDifference}) is not positive number`);
    }
    this.initializer = createInitializer(initializationMethod);
  }

  /**
   * Classify the given points.
   *
   * @param points The points to be classified.
   * @param size The size of clusters.
   * @throws {TypeError} if the size is not positive integer.
   */
  classify(points: Point3[], size: number): Point3[] {
    if (!Number.isInteger(size) || size <= 0) {
      throw new TypeError(`The size(${size}) of cluster must be positive integer`);
    }

    if (points.length <= size) {
      return [...points];
    }

    const centroids = this.initializer.initialize<Point3>(points, size);
    const clusters = centroids.map((centroid: Point3): Cluster => {
      return new Cluster(centroid, this.distanceMeasure);
    });
    for (let i = 0; i < this.maxIterations; i++) {
      const updated = this.iterate(clusters, points);
      if (!updated) {
        break;
      }
    }
    return clusters.map((cluster: Cluster): Point3 => cluster.getCentroid());
  }

  private iterate(clusters: Cluster[], points: Point3[]): boolean {
    clusters.forEach((cluster: Cluster) => cluster.clear());

    points.forEach((point: Point3) => {
      const nearestCluster = Kmeans.findNearestCluster(clusters, point);
      nearestCluster.insert(point);
    });

    let updated = true;
    clusters.forEach((cluster: Cluster) => {
      const difference = cluster.updateCentroid();
      if (difference < this.minDifference) {
        updated = false;
      }
    }, 0.0);
    return updated;
  }

  private static findNearestCluster(clusters: Cluster[], point: Point3): Cluster {
    let nearestCluster: Cluster = clusters[0];
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
