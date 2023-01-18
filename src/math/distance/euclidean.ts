import { Distance, Point } from '../types';
import { toDistance } from '../utils';

import { SquaredEuclideanDistance } from './squaredEuclidean';

/**
 * The euclidean distance formula.
 *
 * @param P The type of point.
 */
export class EuclideanDistance<P extends Point> extends SquaredEuclideanDistance<P> {
  /**
   * {@inheritDoc DistanceFunction.measure}
   */
  measure(point1: P, point2: P): Distance {
    const squaredDistance = super.measure(point1, point2);
    return toDistance(Math.sqrt(squaredDistance));
  }
}
