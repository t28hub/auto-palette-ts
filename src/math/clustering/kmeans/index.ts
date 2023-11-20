import { DistanceFunction } from '../../distance';
import { KDTreeSearch } from '../../neighbors';
import { Point } from '../../point';
import { ClusteringAlgorithm } from '../algorithm';
import { Cluster } from '../cluster';

import { KmeansCluster } from './cluster';
import { CenterInitializer, KmeansPlusPlusInitializer } from './initializer';

export { type CenterInitializer, KmeansPlusPlusInitializer } from './initializer';

/**
 * Implementation of the k-means clustering algorithm.
 *
 * @param P The type of point.
 * @see [Wikipedia - k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering)
 */
export class Kmeans<P extends Point> implements ClusteringAlgorithm<P> {
  /**
   * Create a new Kmeans instance.
   *
   * @param k The number of clusters.
   * @param maxIterations The maximum number of iterations.
   * @param tolerance The tolerance for convergence conditions.
   * @param distanceFunction The function to measure the distance between two points.
   * @param centerInitializer The strategy to initialize center points.
   * @throws {TypeError} if any constructor arguments are invalid.
   */
  constructor(
    private readonly k: number,
    private readonly maxIterations: number,
    private readonly tolerance: number,
    private readonly distanceFunction: DistanceFunction,
    private readonly centerInitializer: CenterInitializer<P> = new KmeansPlusPlusInitializer(distanceFunction),
  ) {
    if (!Number.isInteger(k) || k <= 0) {
      throw new TypeError(`The number of cluster must be a positive integer: ${k}`);
    }
    if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
      throw new TypeError(`The maximum number of iterations must be a positive integer: ${maxIterations}`);
    }
    if (!Number.isFinite(tolerance) || tolerance < 0) {
      throw new TypeError(`The tolerance must be a positive number: ${tolerance}`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      throw new Error('The points array is empty');
    }

    if (points.length <= this.k) {
      return points.map((point: P, index: number): KmeansCluster<P> => {
        const cluster = new KmeansCluster(index, point, this.distanceFunction);
        cluster.add(point);
        return cluster;
      });
    }

    const clusters = this.centerInitializer
      .initialize(points, this.k)
      .map((center: P, index: number): KmeansCluster<P> => new KmeansCluster(index, center, this.distanceFunction));
    for (let i = 0; i < this.maxIterations; i++) {
      const updated = this.iterate(clusters, points);
      if (!updated) {
        break;
      }
    }
    return clusters;
  }

  /**
   * Performs one iteration of the Kmeans algorithm.
   *
   * @param clusters The current clusters.
   * @param points The points to cluster.
   * @returns Whether any cluster was updated.
   */
  private iterate(clusters: KmeansCluster<P>[], points: P[]): boolean {
    const centroids = this.computeNewCentroids(clusters);
    this.assignPoints(clusters, points, centroids);

    let updated = false;
    clusters.forEach((cluster: KmeansCluster<P>) => {
      const difference = cluster.updateCentroid();
      if (difference >= this.tolerance) {
        updated = true;
      }
    }, 0.0);
    return updated;
  }

  /**
   * Computes new centroids for the given clusters.
   *
   * @param clusters The clusters for which to compute new centroids.
   * @returns The new centroids.
   */
  private computeNewCentroids(clusters: KmeansCluster<P>[]): P[] {
    return clusters.reduce((centroids: P[], cluster: KmeansCluster<P>) => {
      centroids.push(cluster.computeCentroid());
      cluster.clear();
      return centroids;
    }, []);
  }

  /**
   * Assigns each point to the nearest cluster.
   *
   * @param clusters The clusters to which to assign points.
   * @param points The points to assign.
   * @param centroids The centroids of the clusters.
   */
  private assignPoints(clusters: KmeansCluster<P>[], points: P[], centroids: P[]): void {
    const neighborSearch = KDTreeSearch.build(centroids, this.distanceFunction);
    points.forEach((point: P) => {
      const neighbor = neighborSearch.searchNearest(point);
      const nearestCluster = clusters[neighbor.index];
      nearestCluster.add(point);
    });
  }
}
