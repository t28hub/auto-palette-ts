import { DistanceMeasure, Point3, SquaredEuclideanDistance } from '../math';

import { ClusterSet } from './clusterSet';
import { createInitializer, Initializer, MethodName } from './initializer';

const DEFAULT_MAX_ITERATIONS = 10;
const DEFAULT_TOLERANCE = 0.025;

export class Kmeans {
  private readonly initializer: Initializer;

  /**
   * Create a new {@link Kmeans} instance
   *
   * @param initializationMethod The name of initialization method.
   * @param maxIterations The max iteration.
   * @param tolerance The tolerance.
   */
  constructor(
    initializationMethod: MethodName = 'kmeans++',
    private readonly distanceMeasure: DistanceMeasure = SquaredEuclideanDistance,
    private readonly maxIterations: number = DEFAULT_MAX_ITERATIONS,
    private readonly tolerance: number = DEFAULT_TOLERANCE,
  ) {
    this.initializer = createInitializer(initializationMethod);
  }

  predict(points: Point3[], count: number): Point3[] {
    if (points.length <= count) {
      return [...points];
    }

    const centers = this.initializer.initialize<Point3>(points, count);
    const clusterSet = new ClusterSet(centers, this.distanceMeasure);
    for (let i = 0; i < this.maxIterations; i++) {
      const oldCenters = clusterSet.getCenters();

      clusterSet.clearPoints();
      clusterSet.classifyPoints(points);
      clusterSet.updateCenters();

      const newCenters = clusterSet.getCenters();
      const difference = this.difference(oldCenters, newCenters);
      if (difference < this.tolerance) {
        break;
      }
    }
    return clusterSet.getCenters();
  }

  private difference(centers1: Point3[], centers2: Point3[]): number {
    let difference = 0.0;
    for (let i = 0; i < centers1.length; i++) {
      const center1 = centers1[i];
      const center2 = centers2[i];
      difference += this.distanceMeasure(center1, center2);
    }
    return difference;
  }
}
