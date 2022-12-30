import { ciede2000 } from '../../color/delta';
import { Coordinate, Swatch } from '../../types';

/**
 * Class representing Node of binary tree.
 */
export class Node {
  /**
   * Create a new node.
   *
   * @param swatch The source swatch.
   * @param left The left of this node.
   * @param right The right of this node.
   */
  constructor(
    readonly swatch: Swatch,
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
    const color1 = this.swatch.color;
    const color2 = other.swatch.color;
    return color1.difference(color2, ciede2000);
  }

  /**
   * Merge this node and the other node.
   *
   * @param other The other node.
   * @return The merged node.
   */
  merge(other: Node): Node {
    const swatch1 = this.swatch;
    const swatch2 = other.swatch;
    const population = swatch1.population + swatch2.population;

    const fraction = swatch1.population / population;
    const color = swatch1.color.mix(swatch2.color, fraction);

    let coordinate: Coordinate;
    if (swatch1.population > swatch2.population) {
      coordinate = { ...swatch1.coordinate };
    } else {
      coordinate = { ...swatch2.coordinate };
    }

    const mergedSwatch: Swatch = { color, population, coordinate };
    return new Node(mergedSwatch, this, other);
  }
}
