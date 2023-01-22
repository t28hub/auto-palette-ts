import { MinimumSpanningTree } from '../graph';
import { kdtree } from '../neighbor';
import { Cluster, Clustering, DistanceFunction, Point, WeightedEdge } from '../types';

/**
 * https://en.wikipedia.org/wiki/Disjoint-set_data_structure
 */
class UnionFind {
  private readonly parents: Uint32Array;
  private readonly sizes: Uint32Array;

  private nextLabel: number;

  constructor(readonly n: number) {
    if (n < 1) {
      throw new RangeError(`The number of node is less than 1: ${n}`);
    }

    this.parents = new Uint32Array(2 * n - 1).map((_: number, index: number) => index);
    this.sizes = new Uint32Array(2 * n - 1).fill(1, 0, n);
    this.nextLabel = n;
  }

  /**
   * Find the root index of root of the given index.
   *
   * @param a The index to find.
   * @return The root index of the given index.
   * @throws {RangeError} if the given index is invalid.
   */
  find(a: number): number {
    if (a < 0) {
      throw new RangeError(`The given index is invalid: ${a}`);
    }

    let root = a;
    let current = a;
    while (this.parents[current] !== current) {
      current = this.parents[current];
    }

    while (this.parents[root] !== current) {
      const tmp = this.parents[root];
      this.parents[root] = current;
      root = tmp;
    }
    return current;
  }

  union(a: number, b: number): number {
    const label = this.nextLabel++;
    this.parents[a] = label;
    this.parents[b] = label;

    const total = this.sizes[a] + this.sizes[b];
    this.sizes[label] = total;
    return total;
  }
}

/**
 * Hierarchical density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [How HDBSCAN Works](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html)
 */
export class HDBSCAN<P extends Point> implements Clustering<P> {
  /**
   * Create a new HDBSCAN.
   *
   * @param minPoints The minimum number of points to compute core distance.
   * @param minClusterSize The minimum number of points required to build a cluster
   * @param distanceFunction The distance function.
   */
  constructor(
    private readonly minPoints: number,
    private readonly minClusterSize: number,
    private readonly distanceFunction: DistanceFunction<P>,
  ) {
    if (this.minPoints < 1) {
      throw new RangeError(`The minimum number of points is less than 1: ${minPoints}`);
    }
    if (this.minClusterSize < 1) {
      throw new RangeError(`The minimum number of cluster size is less than 1: ${minClusterSize}`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      return [];
    }

    const coreDistances = this.createCoreDistances(points);
    const minimumSpanningTree = MinimumSpanningTree.prim(points, (index1: number, index2: number): number => {
      // Use the mutual reachability distance as a weight.
      const distance = this.distanceFunction.measure(points[index1], points[index2]);
      return Math.max(distance, coreDistances[index1], coreDistances[index2]);
    });
    const edges = minimumSpanningTree.getEdges().sort((edge1: WeightedEdge, edge2: WeightedEdge): number => {
      // Sort all edges in ascending order of weight.
      return edge1.weight - edge2.weight;
    });

    const unionFind = new UnionFind(edges.length + 1);
    const labeled = edges.map((edge: WeightedEdge) => {
      // Build a hierarchical dendrogram.
      const u = unionFind.find(edge.u);
      const v = unionFind.find(edge.v);
      const size = unionFind.union(u, v);
      return { u, v, weight: edge.weight, size };
    });
    console.table(labeled);
    return [];
  }

  private createCoreDistances(points: P[]): Float64Array {
    const k = Math.min(points.length, this.minPoints);
    const neighborSearch = kdtree(points, this.distanceFunction);
    return points.reduce((distances: Float64Array, point: P, index: number): Float64Array => {
      const neighbors = neighborSearch.search(point, k);
      const coreNeighbor = neighbors.pop();
      if (!coreNeighbor) {
        throw new Error(`No neighbor point corresponding at ${index} was found`);
      }
      distances[index] = coreNeighbor.distance;
      return distances;
    }, new Float64Array(points.length));
  }
}
