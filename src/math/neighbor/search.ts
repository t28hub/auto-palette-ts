import type { Distance } from '../distance';
import type { Point } from '../point';

/**
 * Type representing the result of a nearest neighbor search.
 */
export interface Neighbor {
  /**
   * The index of this neighbor.
   */
  readonly index: number;

  /**
   * The distance from the query point to this neighbor.
   */
  readonly distance: Distance;
}

/**
 * Interface representing a neighbor search.
 *
 * @param P The type of point.
 */
export interface NeighborSearch<P extends Point> {
  /**
   * Search for the k nearest neighbors to a given query.
   *
   * @param query The query point.
   * @param k The number of nearest neighbors to search for.
   * @return An array of the k nearest neighbors.
   */
  search(query: P, k: number): Neighbor[];

  /**
   * Search for the nearest neighbor to a given query.
   *
   * @param query The query point.
   * @return The nearest neighbor.
   */
  searchNearest(query: P): Neighbor;

  /**
   * Search for neighbors within a given radius from a query point.
   *
   * @param query The query point.
   * @param radius The radius of the search range.
   * @return An array of neighbors within the given radius.
   */
  searchRadius(query: P, radius: number): Neighbor[];
}
