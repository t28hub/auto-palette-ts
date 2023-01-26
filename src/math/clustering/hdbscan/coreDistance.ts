import { euclidean } from '../../distance';
import { kdtree } from '../../neighbor';
import { DistanceFunction, Point } from '../../types';

/**
 * Core distance.
 *
 * [Transform the space](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#transform-the-space)
 */
export class CoreDistance {
  /**
   * Create a new core distance.
   *
   * @param distances The source distance array.
   * @see {CoreDistance.from}
   * @private
   */
  private constructor(private readonly distances: Float32Array) {}

  /**
   * Return the length of this array.
   */
  get length(): number {
    return this.distances.length;
  }

  /**
   * Return the core distance at the given index.
   *
   * @param index The index of the points.
   * @return The core distance corresponding to the given index.
   * @throws {RangeError} if the index is invalid.
   */
  at(index: number): number {
    if (index < 0 || index >= this.distances.length) {
      throw new RangeError(`The given index is out of range[0, ${this.distances.length}): ${index}`);
    }
    return this.distances[index];
  }

  /**
   * Create a new CoreDistance from points.
   *
   * @param points The all points.
   * @param minPoints The minimum number of points to compute core distance.
   * @param distanceFunction The distance function to compute neighbors.
   * @return The CoreDistance instance.
   */
  static from<P extends Point>(
    points: P[],
    minPoints: number,
    distanceFunction: DistanceFunction<P> = euclidean(),
  ): CoreDistance {
    if (points.length === 0) {
      return new CoreDistance(new Float32Array());
    }

    // Add 1 to the minPoints since search method returns points that contains the given point.
    const k = Math.min(points.length, minPoints + 1);
    const neighborSearch = kdtree(points, distanceFunction);
    const distances = points.reduce((distances: Float32Array, point: P, index: number): Float32Array => {
      const neighbors = neighborSearch.search(point, k);
      const coreNeighbor = neighbors.pop();
      if (!coreNeighbor) {
        throw new Error(`No neighbor point corresponding at ${index} was found`);
      }
      distances[index] = coreNeighbor.distance;
      return distances;
    }, new Float32Array(points.length));
    return new CoreDistance(distances);
  }
}
