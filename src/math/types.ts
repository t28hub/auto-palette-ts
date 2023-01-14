/**
 * Type representing 2d point.
 */
export type Point2 = [number, number];

/**
 * Type representing 3d point.
 */
export type Point3 = [number, number, number];

/**
 * Type representing 5d point.
 */
export type Point5 = [number, number, number, number, number];

/**
 * Type representing point.
 */
export type Point = Point2 | Point3 | Point5;

declare const validDistance: unique symbol;

/**
 * Type representing distance.
 */
export type Distance = number & {
  readonly [validDistance]: true;
};

/**
 * Interface to compute the distance between the given 2 points.
 *
 * @param P The type of point.
 */
export interface DistanceFunction<P extends Point> {
  /**
   * Compute the distance between the given 2 points.
   *
   * @param point1 The 1st point.
   * @param point2 The 2nd point.
   * @return The distance between 2 points.
   */
  compute(point1: P, point2: P): Distance;
}

/**
 * Type representing the result of nearest neighbor search.
 *
 * @param P The type of point.
 */
export interface Neighbor<P extends Point> {
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
  readonly distance: Distance;
}

/**
 * Interface representing the nearest neighbor search.
 *
 * @param P The type of point.
 */
export interface NearestNeighborSearch<P extends Point> {
  /**
   * Search the neighbors of the given point.
   *
   * @param query The query point.
   * @param radius The neighbor radius.
   * @return The array of neighbors.
   */
  search(query: P, radius: number): Neighbor<P>[];
}

/**
 * Interface representing cluster.
 *
 * @param P The type of point.
 */
export interface Cluster<P extends Point> {
  /**
   * The size of this cluster.
   */
  readonly size: number;

  /**
   * Whether this cluster is empty or not.
   */
  readonly isEmpty: boolean;

  /**
   * Compute the centroid of this cluster.
   *
   * @return The centroid of this cluster.
   */
  centroid(): P;
}

/**
 * Interface representing clustering algorithm.
 *
 * @param P The type of point.
 */
export interface ClusteringAlgorithm<P extends Point> {
  /**
   * Perform the clustering algorithm to the given points.
   *
   * @param points The points to be clustered.
   * @return The array of clusters.
   */
  fit(points: P[]): Cluster<P>[];
}
