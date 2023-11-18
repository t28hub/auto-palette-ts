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
