import { ArrayQueue } from '../../collection';
import { Point3, Vector } from '../../math';

import { Bounds } from './bounds';

/**
 * Type representing walked result.
 */
export type NodeWalkResult = 'continue' | 'terminate' | 'skip';

/**
 * Function interface for {@link Node.walk}.
 */
export interface NodeWalker {
  /**
   *
   * @param node The current node.
   * @return The result of walk.
   */
  (node: Node): NodeWalkResult;
}

const CHILD_NODE_SIZE = 8;

/**
 * Class representing a node of Octree.
 */
export class Node {
  private bucketCount: number;
  private readonly bucket: Vector<Point3>;
  private readonly childNodes: Node[];

  constructor(
    readonly bounds: Bounds,
    readonly index: number,
    readonly depth: number,
    private readonly maxDepth: number,
  ) {
    this.bucketCount = 0;
    this.bucket = new Vector<Point3>([0, 0, 0]);
    this.childNodes = [];
  }

  get childNodesSize(): number {
    return this.childNodes.length;
  }

  get isLeafNode(): boolean {
    return this.childNodes.length === 0;
  }

  get isEmpty(): boolean {
    return this.bucketCount === 0;
  }

  get size(): number {
    return this.bucketCount;
  }

  getCenter(): Point3 {
    if (this.bucketCount === 0) {
      const center = new Vector(this.bounds.getMinPoint());
      center.add(this.bounds.getMaxPoint());
      center.scale(1 / 2);
      return center.toArray();
    }

    const center = this.bucket.clone();
    center.scale(1 / this.bucketCount);
    return center.toArray();
  }

  insert(point: Point3): boolean {
    if (!this.bounds.contains(point)) {
      return false;
    }

    if (this.isSplittable()) {
      this.split();
    }

    if (this.isLeafNode) {
      this.bucket.add(point);
      this.bucketCount++;
      return true;
    }

    for (const childNode of this.childNodes) {
      if (childNode.insert(point)) {
        return true;
      }
    }
    return false;
  }

  deleteChildNodes(): number {
    let deleted = 0;
    while (this.childNodes.length !== 0) {
      const childNode = this.childNodes.shift();
      if (!childNode) {
        break;
      }

      if (childNode.isLeafNode) {
        deleted++;
      } else {
        deleted += childNode.deleteChildNodes();
      }

      this.bucket.add(childNode.bucket);
      this.bucketCount += childNode.bucketCount;
    }
    return deleted;
  }

  /**
   * Walk nodes by using the breadth-first search.
   *
   * @param walker The walker function.
   */
  walk(walker: NodeWalker) {
    const queue = new ArrayQueue<Node>(this);
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      if (!node) {
        break;
      }

      const result = walker(node);
      switch (result) {
        case 'continue': {
          queue.enqueue(...node.childNodes);
          break;
        }
        case 'terminate': {
          return;
        }
        case 'skip': {
          // Skip child nodes.
          break;
        }
      }
    }
  }

  private isSplittable(): boolean {
    return this.depth <= this.maxDepth && this.isLeafNode;
  }

  private split() {
    for (let i = 0; i < CHILD_NODE_SIZE; i++) {
      this.childNodes[i] = this.createChildNodeAt(i);
    }
  }

  private createChildNodeAt(index: number): Node {
    const indexX = index % 2;
    const indexY = Math.floor(index / 4);
    const indexZ = Math.floor(index / 2) % 2;

    const unitX = this.bounds.extentX / 2;
    const unitY = this.bounds.extentY / 2;
    const unitZ = this.bounds.extentZ / 2;

    const minVector = new Vector(this.bounds.getMinPoint());
    minVector.add([indexX * unitX, indexY * unitY, indexZ * unitZ]);

    const maxVector = minVector.clone();
    maxVector.add([unitX, unitY, unitZ]);

    const childBounds = new Bounds(minVector.toArray(), maxVector.toArray());
    const childIndex = this.index * CHILD_NODE_SIZE + index;
    const childDepth = this.depth + 1;
    return new Node(childBounds, childIndex, childDepth, this.maxDepth);
  }
}
