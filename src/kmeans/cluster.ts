import { Distance, DistanceMeasure, EuclideanDistance, Point3, Vector3 } from '../math';

export class Cluster {
  private readonly center: Vector3;
  private readonly points: Point3[];

  /**
   * Create a new {@link Cluster} instance
   *
   * @param initialCenter The initial center point.
   */
  constructor(initialCenter: Point3) {
    this.center = new Vector3(...initialCenter);
    this.points = [];
  }

  /**
   * Return the size of this cluster.
   */
  get size(): number {
    return this.points.length;
  }

  /**
   * Return whether this cluster is empty.
   */
  get isEmpty(): boolean {
    return this.points.length === 0;
  }

  /**
   * Return the center of this cluster.
   *
   * @return The center of this cluster.
   */
  getCenter(): Point3 {
    return this.center.toArray();
  }

  /**
   * Update the center of this cluster.
   */
  updateCenter() {
    this.center.setZero();
    if (this.isEmpty) {
      return;
    }

    for (const point of this.points) {
      this.center.add(point);
    }
    this.center.scale(1 / this.size);
  }

  /**
   * Insert the point to this cluster.
   *
   * @param point The point to be inserted.
   */
  insert(point: Point3) {
    this.points.push(point);
  }

  /**
   * Clear all points of this cluster.
   */
  clear() {
    this.points.length = 0;
  }

  /**
   * Compute the distance to the center point of this cluster.
   *
   * @param point The point.
   * @param distanceMeasure The distance measure.
   * @return The distance to the center point of this cluster.
   */
  distanceTo(point: Point3, distanceMeasure: DistanceMeasure = EuclideanDistance): Distance {
    return this.center.distanceTo(point, distanceMeasure);
  }
}
