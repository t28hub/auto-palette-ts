import { DistanceFunction, Point } from '../types';

import { EuclideanDistance } from './euclidean';
import { SquaredEuclideanDistance } from './squaredEuclidean';

/**
 * Create the euclidean distance function.
 *
 * @return The euclidean distance function.
 */
export function euclidean<P extends Point>(): DistanceFunction<P> {
  return new EuclideanDistance();
}

/**
 * Create the squared euclidean distance function.
 *
 * @return The squared euclidean distance function.
 */
export function squaredEuclidean<P extends Point>(): DistanceFunction<P> {
  return new SquaredEuclideanDistance();
}
