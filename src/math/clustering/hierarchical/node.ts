/**
 * Interface representing node of hierarchical tree.
 */
export interface HierarchicalNode {
  /**
   * The id of left node.
   */
  readonly left: number;

  /**
   * The id of right node.
   */
  readonly right: number;

  /**
   * The weight of this node.
   */
  readonly weight: number;

  /**
   * The size of this node.
   */
  readonly size: number;
}
