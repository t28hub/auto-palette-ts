import { Point } from '../point';
import { Vector } from '../vector';

/**
 * Class representing a cluster.
 *
 * @param P The type of point.
 */
export class Cluster<P extends Point> {
  protected readonly centroid: Vector<P>;
  protected readonly memberships: Set<number>;

  /**
   * Create a new Cluster instance.
   *
   * @param initialCentroid The initial centroid point.
   */
  constructor(initialCentroid: P | Vector<P>) {
    this.centroid = initialCentroid instanceof Vector ? initialCentroid.clone() : new Vector(initialCentroid);
    this.memberships = new Set();
  }

  /**
   * The number of points in this cluster.
   */
  get size(): number {
    return this.memberships.size;
  }

  /**
   * Whether the cluster is empty.
   */
  get isEmpty(): boolean {
    return this.memberships.size === 0;
  }

  /**
   * Return the centroid of the cluster.
   *
   * @return The centroid of the cluster.
   */
  getCentroid(): P {
    return this.centroid.toArray();
  }

  /**
   * Return the indices of points in this cluster.
   *
   * @return The set of indices of points in this cluster.
   */
  getMemberships(): Set<number> {
    return new Set(this.memberships);
  }

  /**
   * Add a point to this cluster by index.
   *
   * @param index The index of the point.
   * @param point The point to add.
   * @throws {RangeError} If the index is less than 0.
   */
  addMember(index: number, point: P): void {
    if (index < 0) {
      throw new RangeError(`The index(${index}) is less than 0`);
    }

    if (this.memberships.has(index)) {
      return;
    }

    this.centroid.scale(this.memberships.size);
    this.centroid.add(point);
    this.centroid.scale(1 / (this.memberships.size + 1));

    // Set the membership of the point to this cluster.
    this.memberships.add(index);
  }

  /**
   * Clear this cluster.
   */
  clear(): void {
    this.centroid.setZero();
    this.memberships.clear();
  }
}
