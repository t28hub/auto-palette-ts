import { DistanceFunction, Point, euclidean } from '../../math';

import { Neighbor, NNS } from './nns';
import { Node } from './node';

/**
 * NNS implementation of KD-tree.
 *
 * @param P The type of point.
 */
export class KDTree<P extends Point> implements NNS<P> {
  private readonly points: P[];

  /**
   * Create a new KDTree.
   *
   * @private
   * @param root The root node.
   * @param points The points.
   * @param distanceFunction The distance function.
   * @see build
   */
  private constructor(
    private readonly root: Node,
    points: P[],
    private readonly distanceFunction: DistanceFunction<P>,
  ) {
    this.points = Array.from(points);
  }

  search(query: P, radius: number): Neighbor<P>[] {
    if (radius <= 0.0) {
      throw new RangeError(`The radius is not positive number: ${radius}`);
    }

    const neighbors = new Array<Neighbor<P>>();
    this.searchNode(this.root, query, radius, neighbors);
    return neighbors;
  }

  private searchNode(node: Node | undefined, query: P, radius: number, neighbors: Neighbor<P>[]) {
    if (!node) {
      return;
    }

    const point = this.points[node.index];
    const distance = this.distanceFunction.compute(query, point);
    if (distance <= radius) {
      neighbors.push({ index: node.index, point, distance });
    }

    const delta = query[node.axis] - point[node.axis];
    if (Math.abs(delta) <= radius) {
      this.searchNode(node.left, query, radius, neighbors);
      this.searchNode(node.right, query, radius, neighbors);
    } else if (delta < 0) {
      this.searchNode(node.left, query, radius, neighbors);
    } else {
      this.searchNode(node.right, query, radius, neighbors);
    }
  }

  /**
   * Build a KDTree from the given points.
   *
   * @param points The points.
   * @param distanceFunction The distance function.
   * @return The created KDTree.
   */
  static build<P extends Point>(points: P[], distanceFunction: DistanceFunction<P> = euclidean()): KDTree<P> {
    const indices = new Uint32Array(points.length).map((_: number, index: number) => index);
    const root = this.buildNode(points, indices, 0);
    if (!root) {
      throw new Error('The given points is empty');
    }
    return new KDTree<P>(root, points, distanceFunction);
  }

  private static buildNode<P extends Point>(
    points: ReadonlyArray<P>,
    indices: Uint32Array,
    depth: number,
  ): Node | undefined {
    if (indices.length <= 0) {
      return undefined;
    }

    const dimension = points[0].length;
    const axis = depth % dimension;
    const median = Math.floor(indices.length / 2);

    // Sort indices by the value corresponding to the current axis.
    indices.sort((index1: number, index2: number): number => {
      return points[index1][axis] - points[index2][axis];
    });

    const left = this.buildNode(points, indices.slice(0, median), depth + 1);
    const right = this.buildNode(points, indices.slice(median + 1), depth + 1);
    return new Node(indices[median], axis, left, right);
  }
}
