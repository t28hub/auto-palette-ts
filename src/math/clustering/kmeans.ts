import { kdtree } from '../neighbor';
import { Cluster, Clustering, DistanceFunction, Point } from '../types';

import { CenterInitializer, KmeansPlusPlusInitializer } from './centerInitializer';
import { KmeansCluster } from './kmeansCluster';

/**
 * Kmeans clustering algorithm implementation.
 *
 * @param P The type of point.
 * @see [Wikipedia - k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering)
 */
export class Kmeans<P extends Point> implements Clustering<P> {
  /**
   * Create a new Kmeans.
   *
   * @param k The number of clusters.
   * @param maxIterations The max number of iterations.
   * @param tolerance The tolerance of convergence conditions.
   * @param distanceFunction The distance function.
   * @param centerInitializer The center point initializer.
   * @throws {TypeError} if any constructor arguments are invalid.
   */
  constructor(
    private readonly k: number,
    private readonly maxIterations: number,
    private readonly tolerance: number,
    private readonly distanceFunction: DistanceFunction<P>,
    private readonly centerInitializer: CenterInitializer<P> = new KmeansPlusPlusInitializer(distanceFunction),
  ) {
    if (!Number.isInteger(k) || k <= 0) {
      throw new TypeError(`The number of cluster is positive integer: ${k}`);
    }
    if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
      throw new TypeError(`The max iteration is not positive integer: ${maxIterations}`);
    }
    if (!Number.isFinite(tolerance) || tolerance < 0) {
      throw new TypeError(`The min difference(${tolerance}) is not positive number`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length <= this.k) {
      return points.map((point: P): KmeansCluster<P> => {
        const cluster = new KmeansCluster(point, this.distanceFunction);
        cluster.append(point);
        return cluster;
      });
    }

    const clusters = this.centerInitializer
      .initialize(points, this.k)
      .map((center: P): KmeansCluster<P> => new KmeansCluster(center, this.distanceFunction));
    for (let i = 0; i < this.maxIterations; i++) {
      const updated = this.iterate(clusters, points);
      if (!updated) {
        break;
      }
    }
    return clusters;
  }

  private iterate(clusters: KmeansCluster<P>[], points: P[]): boolean {
    const centroids = clusters.reduce((centroids: P[], cluster: KmeansCluster<P>) => {
      centroids.push(cluster.centroid());
      cluster.clear();
      return centroids;
    }, []);

    const neighborSearch = kdtree(centroids, this.distanceFunction);
    points.forEach((point: P) => {
      const neighbor = neighborSearch.searchNearest(point);
      const nearestCluster = clusters[neighbor.index];
      nearestCluster.append(point);
    });

    let updated = true;
    clusters.forEach((cluster: KmeansCluster<P>) => {
      const difference = cluster.updateCenter();
      if (difference < this.tolerance) {
        updated = false;
      }
    }, 0.0);
    return updated;
  }
}
