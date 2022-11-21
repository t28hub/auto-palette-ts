import { Distance, DistanceMeasure, EuclideanDistance, Point, toDistance, Vector } from '../math';

export class Cluster<P extends Point> {
  private readonly centroid: Vector<P>;
  private readonly children: P[];

  /**
   * Create a new {@link Cluster} instance
   *
   * @param initialCentroid The initial centroid.
   * @param distanceMeasure The distance measure.
   * @throws {TypeError} if the initial centroid is invalid.
   */
  constructor(initialCentroid: P, private readonly distanceMeasure: DistanceMeasure = EuclideanDistance) {
    this.centroid = new Vector(initialCentroid);
    this.children = [];
  }

  /**
   * Return the size of this cluster.
   */
  get size(): number {
    return this.children.length;
  }

  /**
   * Return whether this cluster is empty.
   */
  get isEmpty(): boolean {
    return this.children.length === 0;
  }

  /**
   * Return the centroid of this cluster.
   *
   * @return The center of this cluster.
   */
  getCentroid(): P {
    return this.centroid.toArray();
  }

  /**
   * Update the centroid of this cluster.
   *
   * @return The distance between old centroid and new centroid.
   */
  updateCentroid(): Distance {
    this.centroid.setZero();
    if (this.isEmpty) {
      return toDistance(0.0);
    }

    const oldCentroid = this.centroid.toArray();
    for (const point of this.children) {
      this.centroid.add(point);
    }
    this.centroid.scale(1 / this.size);

    const newCentroid = this.centroid.toArray();
    return this.distanceMeasure(oldCentroid, newCentroid);
  }

  /**
   * Insert the point to this cluster.
   *
   * @param point The point to be inserted.
   */
  insert(point: P) {
    this.children.push(point);
  }

  /**
   * Clear all points of this cluster.
   */
  clear() {
    this.children.length = 0;
  }

  /**
   * Compute the distance to the centroid point of this cluster.
   *
   * @param point The point.
   * @return The distance to the centroid of this cluster.
   */
  distanceTo(point: P): Distance {
    return this.centroid.distanceTo(point, this.distanceMeasure);
  }
}
