import { toDistance, Distance, DistanceFunction } from '../../distance';
import { Point } from '../../point';
import { Vector } from '../../vector';
import { MutableCluster } from '../cluster';

export class KmeansCluster<P extends Point> extends MutableCluster<P> {
  private readonly centroid: Vector<P>;

  /**
   * Create a new {@link KmeansCluster} instance
   *
   * @param id The cluster ID.
   * @param initialCenter The initial centroid point.
   * @param distanceFunction The distance function.
   * @throws {TypeError} if the initial centroid point is invalid.
   */
  constructor(
    id: number,
    initialCenter: P,
    private readonly distanceFunction: DistanceFunction,
  ) {
    super(id);
    this.centroid = new Vector(initialCenter);
  }

  /**
   * Compute the centroid of this cluster.
   *
   * @return The centroid of this cluster.
   */
  computeCentroid(): P {
    return this.centroid.toArray();
  }

  /**
   * Update the centroid point of this cluster.
   *
   * @return The distance between old centroid point and new centroid point.
   */
  updateCentroid(): Distance {
    this.centroid.setZero();
    if (this.isEmpty) {
      return toDistance(0.0);
    }

    const oldCenter = this.centroid.toArray();
    for (const point of this.points) {
      this.centroid.add(point);
    }
    this.centroid.scale(1 / this.size);

    const newCenter = this.centroid.toArray();
    return this.distanceFunction(oldCenter, newCenter);
  }

  /**
   * Compute the distance to the centroid point of this cluster.
   *
   * @param point The point.
   * @return The distance to the centroid of this cluster.
   */
  distanceTo(point: P): Distance {
    return this.centroid.distanceTo(point, this.distanceFunction);
  }
}
