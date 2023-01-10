import { Point } from '../../math';

/**
 * Type representing the result of nearest neighbor search.
 *
 * @param P The type of point.
 * @see NNS
 */
export type Neighbor<P extends Point> = {
  /**
   * The index of this neighbor.
   */
  readonly index: number;

  /**
   * The point of this neighbor.
   */
  readonly point: P;

  /**
   * The distance between the query to this neighbor.
   */
  readonly distance: number;
};

/**
 * Interface representing the nearest neighbor search.
 *
 * @param P The type of point.
 */
export interface NNS<P extends Point> {
  /**
   * Search the neighbors of the given point.
   *
   * @param query The query point.
   * @param radius The neighbor radius.
   */
  search(query: P, radius: number): Neighbor<P>[];
}
