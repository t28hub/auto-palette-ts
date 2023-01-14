import { euclidean } from '../distance';
import { DistanceFunction, NearestNeighborSearch, Point } from '../types';

import { KDTree } from './kdtree';
import { LinearSearch } from './linear';

/**
 * Create a new KDTree from the given points.
 *
 * @param points The points.
 * @param distanceFunction The distance function.
 */
export function kdtree<P extends Point>(
  points: P[],
  distanceFunction: DistanceFunction<P> = euclidean(),
): NearestNeighborSearch<P> {
  return KDTree.build(points, distanceFunction);
}

/**
 * Create a new LinearSearch from the given points.
 *
 * @param points The points.
 * @param distanceFunction The distance function.
 */
export function linear<P extends Point>(
  points: P[],
  distanceFunction: DistanceFunction<P> = euclidean(),
): NearestNeighborSearch<P> {
  return new LinearSearch(points, distanceFunction);
}
