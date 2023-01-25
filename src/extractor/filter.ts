import { AlphaChannel } from '../types';

const DEFAULT_THRESHOLD = 0.5;

/**
 * Interface of color filtering.
 *
 * @param T The type of color.
 */
export interface ColorFilter<T extends AlphaChannel> {
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
export function opacity<T extends AlphaChannel>(threshold: number = DEFAULT_THRESHOLD): ColorFilter<T> {
  return {
    test(color: T): boolean {
      return color.opacity >= threshold;
    },
  };
}

/**
 * Composite the given filters to a single filter.
 *
 * @param filters The filters to be composite.
 * @return The composite filter.
 */
export function composite<T extends AlphaChannel>(...filters: ColorFilter<T>[]): ColorFilter<T> {
  return {
    test(color: T): boolean {
      return filters.every((filter: ColorFilter<T>) => filter.test(color));
    },
  };
}
