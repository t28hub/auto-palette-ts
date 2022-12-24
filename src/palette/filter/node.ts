import { HSLColor } from '../../color/hsl';
import { Color, Swatch } from '../../types';

export class Node {
  constructor(
    readonly color: Color,
    readonly population: number,
    readonly left: Node | undefined = undefined,
    readonly right: Node | undefined = undefined,
  ) {}

  distanceTo(other: Node): number {
    return this.color.distanceTo(other.color);
  }

  static create(swatch: Swatch<Color>): Node {
    return new Node(swatch.color, swatch.population);
  }

  static merge(left: Node, right: Node): Node {
    const population = left.population + right.population;
    const color1 = left.color as HSLColor;
    const color2 = right.color as HSLColor;
    const h = (color1.h * left.population + color2.h * right.population) / population;
    const s = (color1.s * left.population + color2.s * right.population) / population;
    const l = (color1.l * left.population + color2.l * right.population) / population;
    const color = new HSLColor(h, s, l, 1.0);
    return new Node(color, population, left, right);
  }
}
