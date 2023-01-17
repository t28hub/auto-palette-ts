import { Mutable, PriorityQueue, Queue } from '../../utils';
import { DistanceFunction, Neighbor, NeighborSearch, Point } from '../types';

/**
 * NNS implementation of linear search
 *
 * @param P The type of point.
 */
export class LinearSearch<P extends Point> implements NeighborSearch<P> {
  /**
   * Create a new LinearSearch.
   *
   * @param points The points to be searched.
   * @param distanceFunction The distance function.
   * @throws {TypeError} if the given points is empty.
   */
  constructor(private readonly points: P[], private readonly distanceFunction: DistanceFunction<P>) {
    if (points.length === 0) {
      throw new TypeError('The points is empty');
    }
  }

  /**
   * {@inheritDoc NeighborSearch.nearest}
   */
  nearest(query: P): Neighbor<P> {
    return this.points.reduce(
      (neighbor: Mutable<Neighbor<P>>, point: P, index: number): Mutable<Neighbor<P>> => {
        if (index === 0) {
          return neighbor;
        }

        const distance = this.distanceFunction.compute(point, query);
        if (distance < neighbor.distance) {
          neighbor.index = index;
          neighbor.point = point;
          neighbor.distance = distance;
        }
        return neighbor;
      },
      { index: 0, point: this.points[0], distance: this.distanceFunction.compute(this.points[0], query) },
    );
  }

  /**
   * {@inheritDoc NeighborSearch.search}
   */
  search(query: P, k: number): Neighbor<P>[] {
    if (k < 1) {
      throw new RangeError(`The k is less than 1: ${k}`);
    }

    const queue = this.points.reduce((neighbors: Queue<Neighbor<P>>, point: P, index: number): Queue<Neighbor<P>> => {
      const distance = this.distanceFunction.compute(point, query);
      if (neighbors.size < k) {
        neighbors.enqueue({ index, point, distance });
        return neighbors;
      }

      const neighbor = neighbors.peek();
      if (neighbor && distance < neighbor.distance) {
        neighbors.dequeue();
        neighbors.enqueue({ index, point, distance });
      }
      return neighbors;
    }, new PriorityQueue((neighbor: Neighbor<P>) => neighbor.distance));

    const neighbors = new Array<Neighbor<P>>();
    while (!queue.isEmpty) {
      const headElement = queue.dequeue();
      if (!headElement) {
        break;
      }
      neighbors.unshift(headElement);
    }
    return neighbors;
  }

  /**
   * {@inheritDoc NeighborSearch.searchRadius}
   */
  range(query: P, radius: number): Neighbor<P>[] {
    if (radius < 0.0) {
      throw new RangeError(`The given radius is not positive: ${radius}`);
    }

    const neighbors = this.points.reduce((previous: Neighbor<P>[], point: P, index: number): Neighbor<P>[] => {
      if (point === query) {
        return previous;
      }

      const distance = this.distanceFunction.compute(point, query);
      if (distance <= radius) {
        previous.push({ index, point, distance });
      }
      return previous;
    }, []);

    return neighbors.sort((neighbor1: Neighbor<P>, neighbor2: Neighbor<P>): number => {
      return neighbor1.distance - neighbor2.distance;
    });
  }
}
