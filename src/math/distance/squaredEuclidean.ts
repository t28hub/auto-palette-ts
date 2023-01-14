import { Distance, DistanceFunction, Point } from '../types';
import { toDistance } from '../utils';

/**
 * The squared euclidean distance formula.
 */
export class SquaredEuclideanDistance<P extends Point> implements DistanceFunction<P> {
  compute(point1: P, point2: P): Distance {
    const distance = point1.reduce((total: number, value: number, index: number): number => {
      const delta = point2[index] - value;
      return total + delta * delta;
    }, 0.0);
    return toDistance(distance);
  }
}
