import { Cluster, Distance, DistanceFunction, Point, toDistance, Vector } from '../../math';

export class KmeansCluster<P extends Point> implements Cluster<P> {
  private readonly center: Vector<P>;
  private readonly points: P[];

  /**
   * Create a new {@link KmeansCluster} instance
   *
   * @param initialCenter The initial center point.
   * @param distanceFunction The distance function.
   * @throws {TypeError} if the initial center point is invalid.
   */
  constructor(initialCenter: P, private readonly distanceFunction: DistanceFunction<P>) {
    this.center = new Vector(initialCenter);
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
   * Compute the centroid of this cluster.
   *
   * @return The centroid of this cluster.
   */
  centroid(): P {
    return this.center.toArray();
  }

  /**
   * Update the center point of this cluster.
   *
   * @return The distance between old center point and new center point.
   */
  updateCenter(): Distance {
    this.center.setZero();
    if (this.isEmpty) {
      return toDistance(0.0);
    }

    const oldCenter = this.center.toArray();
    for (const point of this.points) {
      this.center.add(point);
    }
    this.center.scale(1 / this.size);

    const newCenter = this.center.toArray();
    return this.distanceFunction.compute(oldCenter, newCenter);
  }

  /**
   * Append the given point to this cluster.
   *
   * @param point The point to be inserted.
   */
  append(point: P) {
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
   * @return The distance to the center of this cluster.
   */
  distanceTo(point: P): Distance {
    return this.center.distanceTo(point, this.distanceFunction);
  }
}
