import { Color } from '../../types';

/**
 * Class representing Node of binary tree.
 */
export class Node {
  /**
   * Create a new node.
   *
   * @param color The color of this node.
   * @param population The population of this node.
   * @param left The left of this node.
   * @param right The right of this node.
   */
  constructor(
    readonly color: Color,
    readonly population: number,
    readonly left: Node | undefined = undefined,
    readonly right: Node | undefined = undefined,
  ) {}

  /**
   * Compute distance to the other node.
   *
   * @param other The other node.
   * @return The distance to the other node.
   */
  distanceTo(other: Node): number {
    return this.color.distanceTo(other.color);
  }

  /**
   * Merge this node and the other node.
   *
   * @param other The other node.
   * @return The merged node.
   */
  merge(other: Node): Node {
    const population = this.population + other.population;
    const fraction = this.population / population;
    const color = this.color.mix(other.color, fraction);
    return new Node(color, population, this, other);
  }
}
