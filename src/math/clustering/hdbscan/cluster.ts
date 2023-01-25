import { Cluster, Point } from '../../types';
import { Vector } from '../../vector';

/**
 * Cluster implementation for HDBSCAN.
 */
export class HDBSCANCluster<P extends Point> implements Cluster<P> {
  private readonly points: P[];

  /**
   * Create a new cluster with label.
   *
   * @param label The unique cluster label.
   *
   * @throws {RangeError} if the label is invalid.
   */
  constructor(readonly label: number) {
    if (label < 0) {
      throw new RangeError(`The given label is invalid: ${label}`);
    }
    this.points = [];
  }

  /**
   * The size of this cluster.
   */
  get size(): number {
    return this.points.length;
  }

  /**
   * Whether this cluster is empty or not.
   */
  get isEmpty(): boolean {
    return this.points.length === 0;
  }

  /**
   * Compute the centroid of this cluster.
   *
   * @return The centroid of this cluster.
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
