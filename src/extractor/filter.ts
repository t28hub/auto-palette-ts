import { AlphaChannel } from '../types';

import { ColorFilter } from './types';

const DEFAULT_THRESHOLD = 0.5;

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
