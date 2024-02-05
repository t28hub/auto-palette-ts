import { KDTreeSearch, NeighborSearch, Point3 } from '../../math';
import { LAB, NamedColor } from '../types';

/**
 * ColorNameFinder class is used to find the name of a color.
 */
export class ColorNameFinder {
  /**
   * Create a new ColorNameFinder instance.
   *
   * @private
   * @param colors The list of named colors.
   * @param neighborSearch The neighbor search instance.
   * @returns A new ColorNameFinder instance.
   */
  private constructor(
    private readonly colors: ReadonlyArray<NamedColor<LAB>>,
    private readonly neighborSearch: NeighborSearch<Point3>,
  ) {}

  /**
   * Find the most similar color name to the given color.
   *
   * @param color The color to find.
   * @returns The most similar color name.
   */
  find(color: LAB): string {
    const point: Point3 = [color.l, color.a, color.b];
    const nearest = this.neighborSearch.searchNearest(point);
    return this.colors[nearest.index].name;
  }

  /**
   * Build a new ColorNameFinder instance from the given named colors.
   *
   * @param colors The list of named colors.
   */
  static build(colors: ReadonlyArray<NamedColor<LAB>>): ColorNameFinder {
    const points = colors.map((named): Point3 => {
      const color = named.color;
      return [color.l, color.a, color.b];
    });
    const neighborSearch = KDTreeSearch.build(points);
    return new ColorNameFinder(colors, neighborSearch);
  }
}
