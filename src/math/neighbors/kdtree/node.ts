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
    if (index < 0) {
      throw new RangeError(`The index is negative: ${index}`);
    }
    if (axis < 0) {
      throw new RangeError(`The axis is negative: ${index}`);
    }
  }

  /**
   * Return whether the node is a leaf node.
   */
  get isLeaf(): boolean {
    return !this.left && !this.right;
  }
}
