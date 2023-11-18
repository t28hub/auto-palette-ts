import { Point } from '../point';

import { Cluster } from './cluster';

/**
 * Interface representing clustering algorithm.
 *
 * @param P The type of point.
 */
export interface ClusteringAlgorithm<P extends Point> {
  /**
   * Perform the clustering algorithm to the given points.
   *
   * @param points The points to be clustered.
   * @return The array of clusters.
   */
  fit(points: P[]): Cluster<P>[];
}
