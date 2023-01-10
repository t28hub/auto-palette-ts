import { ArrayQueue } from '../../collection';
import { Point } from '../../math';

import { Neighbor, NNS } from './nns';

const NO_ID = -1;

/**
 * Density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [Wikipedia - DBSCAN](https://en.wikipedia.org/wiki/DBSCAN)
 */
export class DBSCAN<P extends Point> {
  /**
   * Create a new DBSCAN.
   *
   * @param minPoints The minimum size of cluster.
   * @param radius The neighbor radius.
   * @param nns The NNS algorithm.
   * @throws {RangeError} if the given minPoint is less than 1.
   * @throws {RangeError} if the given radius is less than 0.0.
   */
  constructor(private readonly minPoints: number, private readonly radius: number, private readonly nns: NNS<P>) {
    if (minPoints < 1) {
      throw new RangeError(`The minimum size of cluster(${minPoints}) is not greater than or equal to 1`);
    }
    if (radius < 0.0) {
      throw new RangeError(`The radius(${radius}) is not greater than 0.0`);
    }
  }

  predict(points: P[]): number[] {
    let id = 0;
    const visited = new Set<number>();
    const cluster = new Array<number>(points.length).fill(NO_ID);
    points.forEach((point: P, index: number) => {
      // Skip visited point.
      if (visited.has(index)) {
        return;
      }

      const neighbors = this.nns.search(point, this.radius);
      // Mark as noise point
      if (neighbors.length < this.minPoints) {
        cluster[index] = NO_ID;
        return;
      }

      cluster[index] = id;
      this.classifyNeighbors(neighbors, visited, cluster, id++);
    });
    return cluster;
  }

  private classifyNeighbors(neighbors: Neighbor<P>[], visited: Set<number>, clusters: number[], id: number) {
    const queue = new ArrayQueue(...neighbors);
    while (!queue.isEmpty) {
      const neighbor = queue.dequeue();
      if (!neighbor) {
        continue;
      }

      const index = neighbor.index;
      if (clusters[index] === NO_ID) {
        clusters[index] = id;
      }
      if (visited.has(index)) {
        continue;
      }

      visited.add(index);
      clusters[index] = id;

      const secondaryNeighbors = this.nns.search(neighbor.point, this.radius);
      if (secondaryNeighbors.length >= this.minPoints) {
        queue.enqueue(...secondaryNeighbors);
      }
    }
  }
}
