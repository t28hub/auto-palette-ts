import { assert } from '../../../utils';

/**
 * The node of KDTree
 */
export class Node {
  /**
   * Create a new Node instance.
   *
   * @param axis The index of the coordinate axis used to split.
   * @param indices The indices of the points in the node.
   * @param left The left child node.
   * @param right The right child node.
   *
   * @throws {RangeError} The axis is negative
   */
  private constructor(
    readonly axis: number,
    readonly indices: Uint32Array,
    readonly left: Node | undefined,
    readonly right: Node | undefined,
  ) {
    assert(axis >= 0, `The axis must be non-negative: ${axis}`);
    assert(indices.length > 0, 'The indices must not be empty');
  }

  get index(): number {
    return this.indices[0];
  }

  /**
   * Return whether the node is a leaf node.
   *
   * @return True if the node is a leaf node, false otherwise.
   */
  isLeaf(): boolean {
    return !this.left && !this.right;
  }

  /**
   * Create a node with the given axis, index, left and right child nodes.
   *
   * @param axis - The index of the coordinate axis used to split.
   * @param index - The index of the point in the node.
   * @param left - The left child node.
   * @param right - The right child node.
   * @return The created node.
   */
  static createNode(axis: number, index: number, left: Node | undefined, right: Node | undefined): Node {
    return new Node(axis, Uint32Array.of(index), left, right);
  }

  /**
   * Create a leaf node with the given indices.
   *
   * @param axis - The index of the coordinate axis used to split.
   * @param indices - The indices of the points in the node.
   * @return The created leaf node.
   */
  static createLeaf(axis: number, indices: Uint32Array): Node {
    return new Node(axis, indices, undefined, undefined);
  }
}
