import { Cluster, Clustering, Point } from '../types';

/**
 * Hierarchical density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [Wikipedia - DBSCAN](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html)
 */
export class HDBSCAN<P extends Point> implements Clustering<P> {
  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      return [];
    }
    throw new Error('HDBSCAN algorithm is not implemented.');
  }
}
