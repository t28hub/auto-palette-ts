import { Mutable, PriorityQueue, Queue } from '../../utils';
import { euclidean } from '../distance';
import { DistanceFunction, Neighbor, NeighborSearch, Point } from '../types';

import { KDNode } from './kdnode';

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
    private readonly root: KDNode,
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
    const result: Mutable<Neighbor<P>> = { index: 0, point, distance };
    this.nearestRecursively(this.root, query, result);
    return result;
  }

  search(query: P, k: number): Neighbor<P>[] {
    if (k < 1) {
      throw new RangeError(`The k is less than 1: ${k}`);
    }

    const result = new PriorityQueue((neighbor: Neighbor<P>): number => {
      // Sort in descending order of distance from the given query point.
      return -neighbor.distance;
    });
    this.searchRecursively(this.root, query, k, result);

    const neighbors = new Array<Neighbor<P>>();
    while (neighbors.length < k) {
      const neighbor = result.dequeue();
      if (!neighbor) {
        break;
      }
      neighbors.push(neighbor);
    }
    return neighbors;
  }

  /**
   * {@inheritDoc NeighborSearch.range}
   */
  range(query: P, radius: number): Neighbor<P>[] {
    if (radius <= 0.0) {
      throw new RangeError(`The radius is not positive number: ${radius}`);
    }

    const result = new Array<Neighbor<P>>();
    this.rangeRecursively(this.root, query, radius, result);
    return result;
  }

  private nearestRecursively(node: KDNode | undefined, query: P, neighbor: Mutable<Neighbor<P>>) {
    if (!node) {
      return;
    }

    const index = node.index;
    if (index === neighbor.index) {
      return;
    }

    const point = this.points[index];
    if (node.isLeaf) {
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

  private searchRecursively(node: KDNode | undefined, query: P, k: number, neighbors: Queue<Neighbor<P>>) {
    if (!node) {
      return;
    }

    const index = node.index;
    const point = this.points[index];
    const distance = this.distanceFunction.compute(query, point);
    neighbors.enqueue({ index, point, distance });
    if (node.isLeaf) {
      return;
    }

    const delta = query[node.axis] - point[node.axis];
    const neighbor = neighbors.peek();
    if (neighbors.size < k || (neighbor && Math.abs(delta) <= neighbor.distance)) {
      this.searchRecursively(node.left, query, k, neighbors);
      this.searchRecursively(node.right, query, k, neighbors);
    } else if (delta < 0) {
      this.searchRecursively(node.left, query, k, neighbors);
    } else {
      this.searchRecursively(node.right, query, k, neighbors);
    }
  }

  private rangeRecursively(node: KDNode | undefined, query: P, radius: number, neighbors: Neighbor<P>[]) {
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
      this.rangeRecursively(node.left, query, radius, neighbors);
      this.rangeRecursively(node.right, query, radius, neighbors);
    } else if (delta < 0) {
      this.rangeRecursively(node.left, query, radius, neighbors);
    } else {
      this.rangeRecursively(node.right, query, radius, neighbors);
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
  ): KDNode | undefined {
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
    return new KDNode(indices[median], axis, left, right);
  }
}
