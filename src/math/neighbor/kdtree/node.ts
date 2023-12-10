import { assert } from '../../../utils';

/**
 * The node of KDTree
 */
export class Node {
  /**
   * Create a new Node instance.
   *
   * @param index The index of a point.
   * @param axis The index of the coordinate axis used to split.
   * @param left The left child node.
   * @param right The right child node.
   *
   * @throws {RangeError} if either index or axis is negative
   */
  constructor(
    readonly index: number,
    readonly axis: number,
    readonly left: Node | undefined,
    readonly right: Node | undefined,
  ) {
    assert(index >= 0, `The index must be non-negative: ${index}`);
    assert(axis >= 0, `The axis must be non-negative: ${axis}`);
  }

  /**
   * Return whether the node is a leaf node.
   */
  get isLeaf(): boolean {
    return !this.left && !this.right;
  }
}
