/**
 * The node of KDTree.
 */
export class KDNode {
  /**
   * Create a new KDNode.
   *
   * @param index The index of the point.
   * @param axis The index of the coordinate axis used to split.
   * @param left The left child node.
   * @param right The right child node.
   *
   * @throws {RangeError} if either index or axis is invalid.
   */
  constructor(
    readonly index: number,
    readonly axis: number,
    readonly left: KDNode | undefined,
    readonly right: KDNode | undefined,
  ) {
    if (index < 0) {
      throw new RangeError(`The index is negative: ${index}`);
    }
    if (axis < 0) {
      throw new RangeError(`The axis is negative: ${index}`);
    }
  }

  /**
   * Return whether the node is leaf.
   */
  get isLeaf(): boolean {
    return !this.left && !this.right;
  }
}
