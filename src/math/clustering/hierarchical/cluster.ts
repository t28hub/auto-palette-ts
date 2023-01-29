import { Cluster, Point } from '../../types';
import { Vector } from '../../vector';

/**
 * Cluster implementation for HierarchicalClustering
 *
 * @param P The type of point.
 */
export class HierarchicalCluster<P extends Point> implements Cluster<P> {
  private readonly points: P[];

  /**
   * Create a new cluster for HierarchicalClustering.
   *
   * @param id The cluster id.
   * @param points The points of this cluster.
   */
  constructor(readonly id: number, points: ArrayLike<P> = []) {
    this.points = Array.from(points);
  }

  /**
   * {@inheritDoc Cluster.isEmpty}
   */
  get isEmpty(): boolean {
    return this.points.length === 0;
  }

  /**
   * {@inheritDoc Cluster.size}
   */
  get size(): number {
    return this.points.length;
  }

  /**
   * {@inheritDoc Cluster.centroid}
   */
  centroid(): P {
    if (this.isEmpty) {
      throw new Error('This cluster is empty');
    }

    const total = this.points.reduce((previousVector: Vector<P>, point: P, index: number): Vector<P> => {
      if (index === 0) {
        return previousVector;
      }
      return previousVector.add(point);
    }, new Vector<P>(this.points[0]));
    return total.scale(1 / this.size).toArray();
  }

  /**
   * Append the given point.
   *
   * @param point The point to be appended.
   */
  append(point: P) {
    this.points.push(point);
  }
}
