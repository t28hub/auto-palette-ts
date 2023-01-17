import { Mutable } from '../../utils';
import { euclidean } from '../distance';
import { DistanceFunction, NeighborSearch, Neighbor, Point } from '../types';

/**
 * Interface representing node of KDTree.
 */
interface Node {
  /**
   * The index of the points.
   */
  readonly index: number;

  /**
   * The index of the coordinate axis used to split.
   */
  readonly axis: number;

  /**
   * The left child node.
   */
  readonly left: Node | undefined;

  /**
   * The right child node.
   */
  readonly right: Node | undefined;
}

/**
 * NNS implementation of KD-tree.
 *
 * @param P The type of point.
 */
export class KDTree<P extends Point> implements NeighborSearch<P> {
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

  /**
   * {@inheritDoc NeighborSearch.nearest}
   */
  nearest(query: P): Neighbor<P> {
    // Do not need to check whether the points is empty, since size of points is checked when constructing the KDTree.
    const point = this.points[0];
    const distance = this.distanceFunction.compute(query, point);
    const nearest: Mutable<Neighbor<P>> = { index: 0, point, distance };
    this.nearestRecursively(this.root, query, nearest);
    return nearest;
  }

  /**
   * {@inheritDoc NeighborSearch.search}
   */
  search(query: P, radius: number): Neighbor<P>[] {
    if (radius <= 0.0) {
      throw new RangeError(`The radius is not positive number: ${radius}`);
    }

    const neighbors = new Array<Neighbor<P>>();
    this.searchRecursively(this.root, query, radius, neighbors);
    return neighbors;
  }

  private nearestRecursively(node: Node | undefined, query: P, neighbor: Mutable<Neighbor<P>>) {
    if (!node) {
      return;
    }

    const index = node.index;
    if (index === neighbor.index) {
      return;
    }

    const point = this.points[index];
    if (!node.left && !node.right) {
      const distance = this.distanceFunction.compute(query, point);
      if (distance < neighbor.distance) {
        neighbor.index = index;
        neighbor.point = point;
        neighbor.distance = distance;
      }
      return;
    }

    const delta = query[node.axis] - point[node.axis];
    if (Math.abs(delta) <= neighbor.distance) {
      this.nearestRecursively(node.left, query, neighbor);
      this.nearestRecursively(node.right, query, neighbor);
    } else if (delta < 0) {
      this.nearestRecursively(node.left, query, neighbor);
    } else {
      this.nearestRecursively(node.right, query, neighbor);
    }
  }

  private searchRecursively(node: Node | undefined, query: P, radius: number, neighbors: Neighbor<P>[]) {
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
      this.searchRecursively(node.left, query, radius, neighbors);
      this.searchRecursively(node.right, query, radius, neighbors);
    } else if (delta < 0) {
      this.searchRecursively(node.left, query, radius, neighbors);
    } else {
      this.searchRecursively(node.right, query, radius, neighbors);
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
    return { index: indices[median], axis, left, right };
  }
}