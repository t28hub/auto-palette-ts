import { assert, type Mutable, PriorityQueue, type Queue } from '../../../utils';
import type { DistanceMeasure } from '../../distance';
import type { Point } from '../../point';
import type { Neighbor, NeighborSearch } from '../search';

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
   * @param distanceMeasure The distance measure to measure the distance between two points.
   */
  constructor(
    points: P[],
    private readonly distanceMeasure: DistanceMeasure,
  ) {
    assert(points.length > 0, 'The provided points array is empty');
    // Copy the points array to avoid side effects.
    this.points = [...points];
  }

  /**
   * {@inheritDoc NeighborSearch.search}
   */
  search(query: P, k: number): Neighbor[] {
    assert(k >= 1, `The number of neighbors to be searched(${k}) must be greater than or equal to 1`);
    const queue = new PriorityQueue((neighbor1: Neighbor, neighbor2: Neighbor): number => {
      return neighbor2.distance - neighbor1.distance;
    });

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const distance = this.distanceMeasure(point, query);
      if (queue.size < k) {
        queue.push({ index: i, distance });
        continue;
      }

      const neighbor = queue.peek();
      if (neighbor && distance < neighbor.distance) {
        queue.pop();
        queue.push({ index: i, distance });
      }
    }
    return this.extractNeighbors(queue, k);
  }

  /**
   * {@inheritDoc NeighborSearch.searchNearest}
   */
  searchNearest(query: P): Neighbor {
    const nearest: Mutable<Neighbor> = {
      index: 0,
      distance: this.distanceMeasure(this.points[0], query),
    };
    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      const distance = this.distanceMeasure(point, query);
      if (distance < nearest.distance) {
        nearest.index = i;
        nearest.distance = distance;
      }
    }
    return nearest;
  }

  /**
   * {@inheritDoc NeighborSearch.searchRadius}
   */
  searchRadius(query: P, radius: number): Neighbor[] {
    assert(radius > 0.0, `The radius(${radius}) must be greater than 0.0`);
    const neighbors = new Array<Neighbor>();
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const distance = this.distanceMeasure(point, query);
      if (distance <= radius) {
        neighbors.push({ index: i, distance });
      }
    }

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
