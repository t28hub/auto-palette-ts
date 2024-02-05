import { COLORS } from './colors';
import { ColorNameFinder } from './finder';

let colorNameFinder: ColorNameFinder | null = null;

/**
 * Retrieve the color name finder instance.
 *
 * @returns The color name finder instance.
 */
export function retrieveColorNameFinder(): ColorNameFinder {
  if (!colorNameFinder) {
    colorNameFinder = ColorNameFinder.build(COLORS);
  }
  return colorNameFinder;
}
