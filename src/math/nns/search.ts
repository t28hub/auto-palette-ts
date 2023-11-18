import { Distance } from '../distance/function';
import { Point } from '../point';

/**
 * Type representing the result of nearest nns search.
 *
 * @param P The type of point.
 */
export interface Neighbor<P extends Point> {
  /**
   * The index of this nns.
   */
  readonly index: number;

  /**
   * The point of this nns.
   */
  readonly point: P;

  /**
   * The distance between the query to this nns.
   */
  readonly distance: Distance;
}

/**
 * Interface representing the nns search.
 *
 * @param P The type of point.
 */
export interface NeighborSearch<P extends Point> {
  /**
   * Search the k nearest neighbors to the given query.
   *
   * @param query The query point.
   * @param k The number of nearest neighbors.
   * @return The k nearest neighbors.
   */
  search(query: P, k: number): Neighbor<P>[];

  /**
   * Search the nearest nns of the given point.
   *
   * @param query The query point.
   * @return The nearest nns.
   */
  searchNearest(query: P): Neighbor<P>;

  /**
   * Search the neighbors in the given radius to the given query.
   *
   * @param query The query point.
   * @param radius The radius of search range.
   * @return The neighbors in the given radius.
   */
  searchRadius(query: P, radius: number): Neighbor<P>[];
}
