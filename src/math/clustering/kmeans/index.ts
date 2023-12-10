import { DistanceFunction } from '../../distance';
import { KDTreeSearch } from '../../neighbor';
import { Point } from '../../point';
import { ClusteringAlgorithm } from '../algorithm';
import { Cluster } from '../cluster';

import { assert, assertPositiveInteger } from '../../../utils';
import { InitializationStrategy } from './strategy';

export { KmeansPlusPlusInitializer } from './strategy';

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
   * @param initializationStrategy The strategy to initialize center points.
   */
  constructor(
    private readonly k: number,
    private readonly maxIterations: number,
    private readonly tolerance: number,
    private readonly distanceFunction: DistanceFunction,
    private readonly initializationStrategy: InitializationStrategy<P>,
  ) {
    assertPositiveInteger(k, `The number of cluster must be a positive integer: ${k}`);
    assert(maxIterations > 0, `The maximum number of iterations must be a positive integer: ${maxIterations}`);
    assert(tolerance >= 0.0, `The tolerance must be a positive number: ${tolerance}`);
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    assert(points.length > 0, 'The points array is empty');
    if (points.length <= this.k) {
      return points.map((point: P, index: number): Cluster<P> => {
        const cluster = new Cluster(point);
        cluster.addMember(index, point);
        return cluster;
      });
    }

    const clusters = this.initializationStrategy
      .initialize(points, this.k)
      .map((centroid: P): Cluster<P> => new Cluster(centroid));
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
  private iterate(clusters: Cluster<P>[], points: P[]): boolean {
    const centroids = new Array<P>(clusters.length);
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      centroids[i] = cluster.getCentroid();
      cluster.clear();
    }
    this.assignPoints(clusters, centroids, points);

    let updated = false;
    for (let i = 0; i < clusters.length; i++) {
      const oldCentroid = centroids[i];
      const newCentroid = clusters[i].getCentroid();
      const difference = this.distanceFunction(oldCentroid, newCentroid);
      if (difference >= this.tolerance) {
        updated = true;
      }
    }
    return updated;
  }

  /**
   * Assigns each point to the nearest cluster.
   *
   * @param clusters The clusters to which to assign points.
   * @param centroids The centroids of the clusters.
   * @param points The points to assign.
   */
  private assignPoints(clusters: Cluster<P>[], centroids: P[], points: P[]): void {
    const neighborSearch = KDTreeSearch.build(centroids, this.distanceFunction);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const neighbor = neighborSearch.searchNearest(point);
      const nearestCluster = clusters[neighbor.index];
      nearestCluster.addMember(i, point);
    }
  }
}
