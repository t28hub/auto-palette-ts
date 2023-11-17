import { Cluster, Point } from '../types';
import { Vector } from '../vector';

/**
 * Mutable cluster implementation.
 *
 * @param P The type of point.
 * @internal
 */
export class MutableCluster<P extends Point> implements Cluster<P> {
  protected readonly points: P[];

  /**
   * Create a new cluster.
   *
   * @param id The cluster ID.
   * @param initialPoints The initial points of cluster.
   */
  constructor(
    readonly id: number,
    initialPoints: ArrayLike<P> | Iterable<P> = [],
  ) {
    this.points = Array.from(initialPoints);
  }

  /**
   * {@inheritDoc Cluster.size}
   */
  get size(): number {
    return this.points.length;
  }

  /**
   * {@inheritDoc Cluster.isEmpty}
   */
  get isEmpty(): boolean {
    return this.points.length === 0;
  }

  /**
   * {@inheritDoc Cluster.getPoints}
   */
  getPoints(): P[] {
    return Array.from(this.points);
  }

  /**
   * {@inheritDoc Cluster.computeCentroid}
   */
  computeCentroid(): P {
    if (this.isEmpty) {
      throw new Error('This cluster is empty');
    }

    const total = this.points.reduce((vector: Vector<P>, point: P, index: number): Vector<P> => {
      if (index === 0) {
        return vector;
      }
      return vector.add(point);
    }, new Vector<P>(this.points[0]));
    return total.scale(1 / this.size).toArray();
  }

  /**
   * Insert the given point to this cluster.
   *
   * @param point The point to be inserted.
   * @return The current cluster.
   */
  add(point: P): this {
    this.points.push(point);
    return this;
  }

  /**
   * Clear all points of this cluster.
   *
   * @return The current cluster.
   */
  clear(): this {
    this.points.length = 0;
    return this;
  }
}
