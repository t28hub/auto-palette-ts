import { LFUCache } from '../../utils';
import { COLORS } from './colors';
import { ColorNames } from './names';

const CACHE_CAPACITY = 64;

let colorNameFinder: ColorNames | null = null;

/**
 * Retrieve the ColorNames instance.
 *
 * @returns The ColorNames instance.
 */
export function retrieveColorNames(): ColorNames {
  if (!colorNameFinder) {
    colorNameFinder = new ColorNames(COLORS, new LFUCache(CACHE_CAPACITY));
  }
  return colorNameFinder;
}
