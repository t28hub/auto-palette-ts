/**
 * Interface representing node of a condensed tree.
 */
export interface CondensedNode {
  /**
   * The parent node ID.
   */
  readonly parent: number;

  /**
   * The child node ID.
   */
  readonly child: number;

  /**
   * The lambda value of this node.
   */
  readonly lambda: number;

  /**
   * The size of this node.
   */
  readonly size: number;
}
