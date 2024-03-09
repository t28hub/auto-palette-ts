import { assert, type Mutable, PriorityQueue, type Queue, assertDefined, assertPositiveInteger } from '../../../utils';
import { type DistanceMeasure, euclidean } from '../../distance';
import type { Point } from '../../point';
import type { Neighbor, NeighborSearch } from '../search';

import { Node } from './node';

/**
 * The default leaf size of the KD-tree.
 */
const DEFAULT_LEAF_SIZE = 10;

/**
 * Implementation of nearest neighbor search using a KD-tree.
 *
 * @typeParam P - The type of the point.
 */
export class KDTreeSearch<P extends Point> implements NeighborSearch<P> {
  private readonly points: P[];

  /**
   * Create a new KDTreeSearch instance.
   *
   * @private
   * @param root - The root node of the KD-Tree.
   * @param points - The points to be searched.
   * @param distanceMeasure - The function to measure the distance between two points.
   * @see build
   */
  private constructor(
    private readonly root: Node,
    points: P[],
    private readonly distanceMeasure: DistanceMeasure,
  ) {
    // Copy the points array to avoid side effects.
    this.points = Array.from(points);
  }

  /**
   * {@inheritDoc NeighborSearch.search}
   */
  search(query: P, k: number): Neighbor[] {
    assert(k >= 1, `The number of neighbors to be searched(${k}) must be greater than or equal to 1`);
    const neighbors = new PriorityQueue((neighbor1: Neighbor, neighbor2: Neighbor): number => {
      return neighbor2.distance - neighbor1.distance;
    });
    this.searchRecursively(this.root, query, k, neighbors);
    return neighbors.toArray().sort((neighbor1: Neighbor, neighbor2: Neighbor): number => {
      return neighbor1.distance - neighbor2.distance;
    });
  }

  /**
   * {@inheritDoc NeighborSearch.searchNearest}
   */
  searchNearest(query: P): Neighbor {
    // Do not need to check whether the points are empty, since size of points is checked when constructing the Index.
    const point = this.points[0];
    const distance = this.distanceMeasure(query, point);
    const result: Mutable<Neighbor> = { index: 0, distance };
    this.nearestRecursively(this.root, query, result);
    return result;
  }

  /**
   * {@inheritDoc NeighborSearch.searchRadius}
   */
  searchRadius(query: P, radius: number): Neighbor[] {
    assert(radius > 0.0, `The radius(${radius}) must be greater than 0.0`);
    const result = new Array<Neighbor>();
    this.rangeRecursively(this.root, query, radius, result);
    return result;
  }

  /**
   * Recursively searches for the nearest neighbor in the KD-tree.
   *
   * @private
   * @param node - The current node.
   * @param query - The query point.
   * @param neighbor - The current nearest neighbor.
   */
  private nearestRecursively(node: Node | undefined, query: P, neighbor: Mutable<Neighbor>) {
    if (!node) {
      return;
    }

    if (node.isLeaf()) {
      for (const index of node.indices) {
        const point = this.points[index];
        const distance = this.distanceMeasure(query, point);
        if (distance < neighbor.distance) {
          neighbor.index = index;
          neighbor.distance = distance;
        }
      }
      return;
    }

    const index = node.index;
    const point = this.points[index];
    const distance = this.distanceMeasure(query, point);
    if (distance < neighbor.distance) {
      neighbor.index = index;
      neighbor.distance = distance;
    }

    const delta = query[node.axis] - point[node.axis];
    if (delta < 0) {
      this.nearestRecursively(node.left, query, neighbor);
      if (neighbor.distance >= Math.abs(delta)) {
        this.nearestRecursively(node.right, query, neighbor);
      }
    } else {
      this.nearestRecursively(node.right, query, neighbor);
      if (neighbor.distance >= Math.abs(delta)) {
        this.nearestRecursively(node.left, query, neighbor);
      }
    }
  }

  /**
   * Recursively searches for the k nearest neighbors in the KD-tree.
   *
   * @private
   * @param node - The current node.
   * @param query - The query point.
   * @param k - The number of nearest neighbors to find.
   * @param neighbors - The current nearest neighbors.
   */
  private searchRecursively(node: Node | undefined, query: P, k: number, neighbors: Queue<Neighbor>) {
    if (!node) {
      return;
    }

    if (node.isLeaf()) {
      for (const index of node.indices) {
        const point = this.points[index];
        const distance = this.distanceMeasure(query, point);
        neighbors.push({ index, distance });
        if (neighbors.size > k) {
          neighbors.pop();
        }
      }
      return;
    }

    const index = node.index;
    const point = this.points[index];
    const distance = this.distanceMeasure(query, point);

    const maxDistance = neighbors.peek()?.distance || Number.MAX_VALUE;
    if (neighbors.size < k || distance < maxDistance) {
      neighbors.push({ index, distance });
      // Keep the size of the priority queue to k
      if (neighbors.size > k) {
        neighbors.pop();
      }
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

  /**
   * Recursively searches for neighbors within a given radius in the KD-tree.
   *
   * @private
   * @param node The current node.
   * @param query The query point.
   * @param radius The search radius.
   * @param neighbors The current neighbors within the radius.
   */
  private rangeRecursively(node: Node | undefined, query: P, radius: number, neighbors: Neighbor[]) {
    if (!node) {
      return;
    }

    if (node.isLeaf()) {
      for (const index of node.indices) {
        const point = this.points[index];
        const distance = this.distanceMeasure(query, point);
        if (distance <= radius) {
          neighbors.push({ index, distance });
        }
      }
      return;
    }

    const point = this.points[node.index];
    const distance = this.distanceMeasure(query, point);
    if (distance <= radius) {
      neighbors.push({ index: node.index, distance });
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
   * Build a KDTreeSearch instance from the given points array.
   *
   * @param points - The points to be searched.
   * @param leafSize - The maximum number of points in a leaf node.
   * @param distanceMeasure - The function to measure the distance between two points.
   * @return The built KDTreeSearch instance.
   */
  static build<P extends Point>(
    points: P[],
    leafSize: number = DEFAULT_LEAF_SIZE,
    distanceMeasure: DistanceMeasure = euclidean,
  ): KDTreeSearch<P> {
    assertPositiveInteger(leafSize, 'The leaf size must be a positive integer');
    const indices = new Uint32Array(points.length).map((_: number, index: number) => index);
    const root = KDTreeSearch.buildNode(points, indices, leafSize, 0);
    assertDefined(root, 'The given points array is empty');
    return new KDTreeSearch<P>(root, points, distanceMeasure);
  }

  /**
   * Recursively builds a node of the KD-tree.
   *
   * @private
   * @param points - The points to be searched.
   * @param indices - The indices of the points.
   * @param leafSize - The maximum number of points in a leaf node.
   * @param depth - The current depth of the tree.
   * @return The created node.
   */
  private static buildNode<P extends Point>(
    points: ReadonlyArray<P>,
    indices: Uint32Array,
    leafSize: number,
    depth: number,
  ): Node | undefined {
    if (indices.length <= 0) {
      return undefined;
    }

    const dimension = points[0].length;
    const axis = depth % dimension;

    // Stop node construction if the number of points is less than or equal to the leaf size.
    if (indices.length <= leafSize) {
      return Node.createLeaf(axis, indices);
    }

    const median = Math.floor(indices.length / 2);

    // Sort indices by the value corresponding to the current axis.
    indices.sort((index1: number, index2: number): number => {
      return points[index1][axis] - points[index2][axis];
    });

    const left = KDTreeSearch.buildNode(points, indices.slice(0, median), leafSize, depth + 1);
    const right = KDTreeSearch.buildNode(points, indices.slice(median + 1), leafSize, depth + 1);
    return Node.createNode(axis, indices[median], left, right);
  }
}
