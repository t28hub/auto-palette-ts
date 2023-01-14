import { DistanceFunction, Point } from '../../math';

import { Neighbor, NNS } from './nns';

/**
 * NNS implementation of linear search
 *
 * @param P The type of point.
 */
export class LinearSearch<P extends Point> implements NNS<P> {
  /**
   * Create a new LinearSearch.
   *
   * @param points The points to be searched.
   * @param distanceFunction The distance function.
   */
  constructor(private readonly points: P[], private readonly distanceFunction: DistanceFunction<P>) {}

  /**
   * Search the neighbors from the given query and radius.
   *
   * @param query The query point.
   * @param radius The neighbor radius.
   * @throws RangeError if the given radius is not positive.
   */
  search(query: P, radius: number): Neighbor<P>[] {
    if (radius < 0.0) {
      throw new RangeError(`The given radius(${radius}) is not positive`);
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
