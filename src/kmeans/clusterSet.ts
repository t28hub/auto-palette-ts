import { DistanceMeasure, Point3, toDistance } from '../math';

import { Cluster } from './cluster';

/**
 * Set of clusters.
 */
export class ClusterSet {
  private readonly clusters: Cluster[];

  /**
   * Create a new {@link ClusterSet}.
   *
   * @param initialCenters The array of initial centers.
   * @param distanceMeasure The distance measure.
   */
  constructor(initialCenters: Point3[], private readonly distanceMeasure: DistanceMeasure) {
    if (initialCenters.length === 0) {
      throw new TypeError('Initial centers must contains a point at least');
    }

    this.clusters = initialCenters.map((center: Point3): Cluster => {
      return new Cluster(center);
    });
  }

  /**
   * Return all center points.
   */
  getCenters(): Point3[] {
    return this.clusters.map((cluster: Cluster): Point3 => cluster.getCenter());
  }

  /**
   * Update all center points.
   */
  updateCenters() {
    this.clusters.forEach((cluster: Cluster) => cluster.updateCenter());
  }

  /**
   * Classify the given points.
   *
   * @param points The points to be classified.
   */
  classifyPoints(points: Point3[]) {
    points.forEach((point: Point3) => {
      const nearestCluster = this.findNearestCluster(point);
      if (!nearestCluster) {
        return;
      }
      nearestCluster.insert(point);
    });
  }

  /**
   * Clear all points.
   */
  clearPoints() {
    this.clusters.forEach((cluster: Cluster) => cluster.clear());
  }

  private findNearestCluster(point: Point3): Cluster | undefined {
    let minDistance = toDistance(Number.MAX_VALUE);
    let nearestCluster: Cluster | undefined;
    for (const cluster of this.clusters) {
      const distance = cluster.distanceTo(point, this.distanceMeasure);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = cluster;
      }
    }
    return nearestCluster;
  }
}
