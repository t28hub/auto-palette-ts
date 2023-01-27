import { DistanceFunction, Graph, Point, WeightedEdge } from '../../types';

import { CoreDistance } from './coreDistance';

/**
 * Graph connecting given points.
 *
 * @param P The type of point.
 */
export class PointGraph<P extends Point> implements Graph<P, WeightedEdge> {
  /**
   * Create a new PointGraph.
   *
   * @param points The all points
   * @param coreDistance The core distance of the points.
   * @param distanceFunction The distance function.
   */
  constructor(
    private readonly points: P[],
    private readonly coreDistance: CoreDistance,
    private readonly distanceFunction: DistanceFunction<P>,
  ) {}

  /**
   * {@inheritDoc Graph.getEdge}
   */
  getEdge(u: number, v: number): WeightedEdge {
    this.checkIndex(u);
    this.checkIndex(v);

    const pointU = this.points[u];
    const pointV = this.points[v];
    const distance = this.distanceFunction.measure(pointU, pointV);

    // Mutual reachability distance
    const weight = Math.max(distance, this.coreDistance.at(u), this.coreDistance.at(v));
    return { u, v, weight };
  }

  /**
   * {@inheritDoc Graph.getVertices}
   */
  getVertices(): P[] {
    return Array.from(this.points);
  }

  /**
   * {@inheritDoc Graph.countVertices}
   */
  countVertices(): number {
    return this.points.length;
  }

  private checkIndex(index: number) {
    if (index < 0 || index >= this.points.length) {
      throw new RangeError(`The given index is out of range [0, ${this.points.length}): ${index}`);
    }
  }
}
