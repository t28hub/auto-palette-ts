import { Mutable, Ordering, PriorityQueue, Queue } from '../../../utils';
import { DistanceFunction } from '../../distance';
import { Point } from '../../point';
import { Neighbor, NeighborSearch } from '../search';

/**
 * Implementation of nearest neighbor search using linear search.
 *
 * @param P The type of point.
 */
export class LinearSearch<P extends Point> implements NeighborSearch<P> {
  private readonly points: P[];

  /**
   * Create a new LinearSearch instance.
   *
   * @param points The points to be searched.
   * @param distanceFunction The function to measure the distance between two points.
   * @throws {TypeError} if the provided points array is empty.
   */
  constructor(
    points: P[],
    private readonly distanceFunction: DistanceFunction,
  ) {
    if (points.length === 0) {
      throw new TypeError('The points is empty');
    }
    // Copy the points array to avoid side effects.
    this.points = [...points];
  }

  /**
   * {@inheritDoc NeighborSearch.search}
   */
  search(query: P, k: number): Neighbor[] {
    if (k < 1) {
      throw new RangeError(`The k is less than 1: ${k}`);
    }

    const queue = new PriorityQueue((neighbor1: Neighbor, neighbor2: Neighbor): Ordering => {
      if (neighbor1.distance < neighbor2.distance) {
        return 1;
      }
      if (neighbor1.distance > neighbor2.distance) {
        return -1;
      }
      return 0;
    });

    this.points.forEach((point: P, index: number) => {
      const distance = this.distanceFunction(point, query);
      if (queue.size < k) {
        queue.push({ index, distance });
        return;
      }

      const neighbor = queue.peek();
      if (neighbor && distance < neighbor.distance) {
        queue.pop();
        queue.push({ index, distance });
      }
    });
    return this.extractNeighbors(queue, k);
  }

  /**
   * {@inheritDoc NeighborSearch.searchNearest}
   */
  searchNearest(query: P): Neighbor {
    const nearest: Mutable<Neighbor> = {
      index: 0,
      distance: this.distanceFunction(this.points[0], query),
    };
    this.points.forEach((point: P, index: number) => {
      if (index === 0) {
        return;
      }

      const distance = this.distanceFunction(point, query);
      if (distance < nearest.distance) {
        nearest.index = index;
        nearest.distance = distance;
      }
    });
    return nearest;
  }

  /**
   * {@inheritDoc NeighborSearch.searchRadius}
   */
  searchRadius(query: P, radius: number): Neighbor[] {
    if (radius < 0.0) {
      throw new RangeError(`The given radius is not positive: ${radius}`);
    }

    const neighbors = new Array<Neighbor>();
    this.points.forEach((point: P, index: number) => {
      const distance = this.distanceFunction(point, query);
      if (distance <= radius) {
        neighbors.push({ index, distance });
      }
    });

    return neighbors.sort((neighbor1: Neighbor, neighbor2: Neighbor): number => {
      return neighbor1.distance - neighbor2.distance;
    });
  }

  /**
   * Extract neighbors from the given queue.
   *
   * @private
   * @param queue The queue of neighbors.
   * @param k The number of neighbors to be extracted.
   * @return The extracted neighbors.
   */
  private extractNeighbors(queue: Queue<Neighbor>, k: number): Neighbor[] {
    const neighbors = new Array<Neighbor>();
    while (neighbors.length < k) {
      const neighbor = queue.pop();
      if (!neighbor) {
        break;
      }
      neighbors.unshift(neighbor);
    }
    return neighbors;
  }
}
