import { Mutable } from '../../utils';
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
  search(query: P, radius: number): Neighbor<P>[] {
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
