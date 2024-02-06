import { KDTreeSearch, NeighborSearch, Point3 } from '../../math';
import { Cache } from '../../utils';
import { toXYZ as labToXYZ } from '../space/lab';
import { toRGB as xyzToRGB } from '../space/xyz';
import { LAB, NamedColor } from '../types';

/**
 * ColorNames class is used to find the name of a color.
 */
export class ColorNames {
  private readonly neighborSearch: NeighborSearch<Point3>;
  /**
   * Create a new ColorNames instance.
   *
   * @param colors The list of named colors.
   * @param cache The cache to store the results.
   * @returns A new ColorNames instance.
   */
  constructor(
    private readonly colors: ReadonlyArray<NamedColor<LAB>>,
    private readonly cache: Cache<number, NamedColor<LAB>>,
  ) {
    const points = colors.map((named): Point3 => {
      const color = named.color;
      return [color.l, color.a, color.b];
    });
    this.neighborSearch = KDTreeSearch.build(points);
  }

  /**
   * Find the most similar color name to the given color.
   *
   * @param color The color to find.
   * @returns The most similar color name.
   */
  find(color: LAB): string {
    const key = ColorNames.createCacheKey(color);
    const cached = this.cache.get(key);
    if (cached) {
      return cached.name;
    }

    const point: Point3 = [color.l, color.a, color.b];
    const nearest = this.neighborSearch.searchNearest(point);
    const namedColor = this.colors[nearest.index];
    this.cache.put(key, namedColor);
    return namedColor.name;
  }

  private static createCacheKey(lab: LAB): number {
    const xyz = labToXYZ(lab);
    const rgb = xyzToRGB(xyz);
    return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
  }
}
