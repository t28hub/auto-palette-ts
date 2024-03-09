import type { LAB } from '../types';

import type { ColorDelta, ColorDeltaMeasure } from './function';

// kL, K1 and K2 are constants. The values are taken from the wikipedia page:
// https://en.wikipedia.org/wiki/Color_difference#CIE94
const kL = 1.0;
const K1 = 0.045;
const K2 = 0.015;

// kC and kH are constants, The values are usually both unity.
const kC = 1.0;
const kH = 1.0;

/**
 * Calculate the color difference between two colors using the CIE94 formula.
 *
 * @param color1 - The 1st color.
 * @param color2 - The 2nd color.
 * @returns The color difference.
 * @see [CIE94 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE94)
 */
export const cie94: ColorDeltaMeasure<LAB> = (color1: LAB, color2: LAB): ColorDelta => {
  const deltaL = color1.l - color2.l;
  const deltaA = color1.a - color2.a;
  const deltaB = color1.b - color2.b;

  const c1 = Math.sqrt(color1.a ** 2 + color1.b ** 2);
  const c2 = Math.sqrt(color2.a ** 2 + color2.b ** 2);
  const deltaC = c1 - c2;
  const deltaH = Math.sqrt(deltaA ** 2 + deltaB ** 2 - deltaC ** 2);

  const sL = 1;
  const sC = 1 + K1 * c1;
  const sH = 1 + K2 * c1;

  const squared = (deltaL / (kL * sL)) ** 2 + (deltaC / (kC * sC)) ** 2 + (deltaH / (kH * sH)) ** 2;
  return Math.sqrt(squared) as ColorDelta;
};
