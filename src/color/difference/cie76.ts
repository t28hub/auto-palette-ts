import { LAB } from '../types';

import { ColorDifference, DifferenceFunction } from './function';

/**
 * Calculate the color difference between two colors using the CIE76 formula.
 *
 * @param color1 - The 1st color.
 * @param color2 - The 2nd color.
 * @returns The color difference.
 * @see [CIE75 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE76)
 */
export const cie76: DifferenceFunction<LAB> = (color1: LAB, color2: LAB): ColorDifference => {
  const deltaL = color1.l - color2.l;
  const deltaA = color1.a - color2.a;
  const deltaB = color1.b - color2.b;
  return Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2) as ColorDifference;
};
