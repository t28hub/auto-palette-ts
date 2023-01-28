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
  measure(point1: P, point2: P): Distance;
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
 * Interface representing the neighbor search.
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
   * Search the nearest neighbor of the given point.
   *
   * @param query The query point.
   * @return The nearest neighbor.
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

/**
 * Interface  representing edge.
 */
export interface Edge {
  /**
   * The index of the source vertex.
   */
  readonly u: number;

  /**
   * The index of the target vertex.
   */
  readonly v: number;
}

/**
 * Interface  representing weighted edge.
 */
export interface WeightedEdge extends Edge {
  /**
   * The weight of this edge.
   */
  readonly weight: number;
}

/**
 * Interface representing undirected graph.
 *
 * @param V The type of vertex.
 * @param E The type of edge.
 */
export interface Graph<V, E extends Edge> {
  /**
   * Return the edge connecting vertices u and v.
   *
   * @param u The index of source vertex.
   * @param v The index of target vertex.
   * @return The edge connecting vertices u and v.
   * @throws {RangeError} if both or either u and v is invalid.
   */
  getEdge(u: number, v: number): E;

  /**
   * Return all vertices in this graph.
   *
   * @return The array of all vertices.
   */
  getVertices(): V[];

  /**
   * Count the number of vertices.
   *
   * @return The number of vertices.
   */
  countVertices(): number;
}

/**
 * Interface representing spanning tree.
 *
 * @param E The type of edge.
 */
export interface SpanningTree<E extends Edge> {
  /**
   * Return the weight of this spanning tree.
   */
  readonly weight: number;

  /**
   * Return a set of edges of this spanning tree.
   *
   * @return An array of edges of this spanning tree.
   */
  getEdges(): E[];
}

/**
 * Interface computing weight of each edge.
 */
export interface WeightFunction {
  /**
   * Compute the weight of the edge connecting u and v.
   *
   * @param u The source index.
   * @param v The target index.
   * @return The weight of the edge connecting u and v.
   */
  compute(u: number, v: number): number;
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
export interface Clustering<P extends Point> {
  /**
   * Perform the clustering algorithm to the given points.
   *
   * @param points The points to be clustered.
   * @return The array of clusters.
   */
  fit(points: P[]): Cluster<P>[];
}
