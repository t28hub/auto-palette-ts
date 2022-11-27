import { Point3 } from '../../math';

import { Bounds } from './bounds';
import { Node, NodeWalkResult } from './node';

const MIN_INDEX = 0;
const MIN_DEPTH = 0;

/**
 * Octree clustering algorithm implementation.
 */
export class Octree {
  private readonly root: Node;

  /**
   * Create a new Octree.
   *
   * @param bounds The bounds of Octree.
   * @param maxDepth The max depth.
   */
  constructor(bounds: Bounds, maxDepth: number) {
    this.root = new Node(bounds, MIN_INDEX, MIN_DEPTH, maxDepth);
  }

  /**
   * Insert the point to this Octree.
   *
   * @param point The point to be inserted.
   * @return true if the point is inserted.
   */
  insert(point: Point3): boolean {
    return this.root.insert(point);
  }

  /**
   * Count the all leaf nodes.
   *
   * @return The number of leaf nodes.
   */
  countLeafNodes(): number {
    let count = 0;
    this.root.walk((node: Node): NodeWalkResult => {
      if (node.isLeafNode) {
        count++;
      }
      return 'continue';
    });
    return count;
  }

  findLeafNodes(): Node[] {
    const found: Node[] = [];
    this.root.walk((node: Node): NodeWalkResult => {
      if (node.isLeafNode) {
        found.push(node);
      }
      return 'continue';
    });
    return found;
  }

  forEachNodes(depth: number, callback: (node: Node) => void) {
    this.root.walk((node: Node): NodeWalkResult => {
      if (node.depth < depth) {
        return 'continue';
      }

      callback(node);
      return 'skip';
    });
  }
}
