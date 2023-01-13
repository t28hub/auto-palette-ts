/**
 * The node class of KDTree.
 */
export class Node {
  /**
   * Create a new node.
   *
   * @param index The index of the points.
   * @param axis  The index of the coordinate axis used to split.
   * @param left  The left child node.
   * @param right The right child node.
   */
  constructor(
    readonly index: number,
    readonly axis: number,
    readonly left: Node | undefined = undefined,
    readonly right: Node | undefined = undefined,
  ) {}
}
