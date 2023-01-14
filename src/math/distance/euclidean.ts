import { Distance, Point } from '../types';
import { toDistance } from '../utils';

import { SquaredEuclideanDistance } from './squaredEuclidean';

/**
 * The euclidean distance formula.
 */
export class EuclideanDistance<P extends Point> extends SquaredEuclideanDistance<P> {
  compute(point1: P, point2: P): Distance {
    const squaredDistance = super.compute(point1, point2);
    return toDistance(Math.sqrt(squaredDistance));
  }
}
