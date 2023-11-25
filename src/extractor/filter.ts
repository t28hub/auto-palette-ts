import { AlphaChannel } from '../color';

const DEFAULT_ALPHA_THRESHOLD = 128;

/**
 * Interface of color filtering.
 *
 * @param T The type of color.
 */
export interface ColorFilter<T> {
  /**
   * Check the color
   *
   * @param color The color to be checked.
   * @return true if the given color is included.
   */
  test(color: T): boolean;
}

/**
 * Create a new color filter by opacity.
 *
 * @param threshold The threshold of opacity.
 * @return The opacity filter.
 */
export function opacity<T>(threshold: number = DEFAULT_ALPHA_THRESHOLD): ColorFilter<AlphaChannel<T>> {
  return {
    test(color: AlphaChannel<T>): boolean {
      return color.a >= threshold;
    },
  };
}

/**
 * Composite the given filters to a single filter.
 *
 * @param filters The filters to be composite.
 * @return The composite filter.
 */
export function composite<T>(...filters: ColorFilter<T>[]): ColorFilter<T> {
  return {
    test(color: T): boolean {
      return filters.every((filter: ColorFilter<T>) => filter.test(color));
    },
  };
}
