import { degreeToRadian, radianToDegree } from '../../math';
import { LAB } from '../types';

import { ColorDifference, DifferenceFunction } from './function';

// Constants for the CIEDE2000 color difference formula.
// kL, kC and kH are usually both unity.
const kL = 1.0;
const kC = 1.0;
const kH = 1.0;
const POW7_25 = Math.pow(25, 7);

/**
 * Calculate the hue prime for the given x and y values.
 *
 * @param x - The x component.
 * @param y - The y component.
 * @returns The hue prime.
 */
function toHPrime(x: number, y: number): number {
  if (x === 0.0 && y === 0.0) {
    return 0.0;
  }

  const angle = radianToDegree(Math.atan2(x, y));
  if (angle >= 0.0) {
    return angle;
  }
  return angle + 360.0;
}

/**
 * Calculate the average hue prime for the given hue primes.
 *
 * @param hPrime1 - The 1st hue prime.
 * @param hPrime2 - The 2nd hue prime.
 * @returns The average hue prime.
 */
function toHBarPrime(hPrime1: number, hPrime2: number): number {
  const deltaHPrime = Math.abs(hPrime1 - hPrime2);
  if (deltaHPrime > 180.0) {
    return (hPrime1 + hPrime2 + 360.0) / 2.0;
  }
  return (hPrime1 + hPrime2) / 2.0;
}

/**
 * Calculate the difference in hue prime for the given hues and chromas.
 *
 * @param c1 - The 1st chroma.
 * @param c2 - The 2nd chroma.
 * @param h1 - The 1st hue.
 * @param h2 - The 2nd hue.
 * @returns The difference in hue prime.
 */
function toDeltaHPrime(c1: number, c2: number, h1: number, h2: number): number {
  if (c1 === 0.0 || c2 === 0.0) {
    return 0.0;
  }

  const deltaH = h2 - h1;
  if (Math.abs(deltaH) <= 180.0) {
    return deltaH;
  }

  if (h2 <= h1) {
    return deltaH + 360.0;
  }
  return deltaH - 360.0;
}

/**
 * Calculate the color difference between two colors using the CIEDE2000 formula.
 *
 * @param color1 - The 1st color.
 * @param color2 - The 2nd color.
 * @returns The color difference.
 * @see [CIEDE2000 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)
 */
export const cie2000: DifferenceFunction<LAB> = (color1: LAB, color2: LAB): ColorDifference => {
  const deltaLPrime = color2.l - color1.l;
  const lBar = (color1.l + color2.l) / 2.0;

  const c1 = Math.sqrt(color1.a ** 2 + color1.b ** 2);
  const c2 = Math.sqrt(color2.a ** 2 + color2.b ** 2);
  const cBar = (c1 + c2) / 2.0;

  const g = Math.sqrt(Math.pow(cBar, 7.0) / (Math.pow(cBar, 7.0) + POW7_25));
  const aPrime1 = color1.a + (color1.a / 2.0) * (1.0 - g);
  const aPrime2 = color2.a + (color2.a / 2.0) * (1.0 - g);

  const cPrime1 = Math.sqrt(aPrime1 * aPrime1 + color1.b * color1.b);
  const cPrime2 = Math.sqrt(aPrime2 * aPrime2 + color2.b * color2.b);
  const cBarPrime = (cPrime1 + cPrime2) / 2.0;
  const deltaCPrime = cPrime2 - cPrime1;

  const hPrime1 = toHPrime(color1.b, aPrime1);
  const hPrime2 = toHPrime(color2.b, aPrime2);
  let deltaHPrime = toDeltaHPrime(c1, c2, hPrime1, hPrime2);
  deltaHPrime = 2.0 * Math.sqrt(cPrime1 * cPrime2) * Math.sin(degreeToRadian(deltaHPrime) / 2.0);

  const hBarPrime = toHBarPrime(hPrime1, hPrime2);
  const t =
    1.0 -
    0.17 * Math.cos(degreeToRadian(hBarPrime - 30.0)) +
    0.24 * Math.cos(degreeToRadian(2.0 * hBarPrime)) +
    0.32 * Math.cos(degreeToRadian(3.0 * hBarPrime + 6.0)) -
    0.2 * Math.cos(degreeToRadian(4.0 * hBarPrime - 63.0));

  const sL = 1.0 + (0.015 * Math.pow(lBar - 50.0, 2)) / Math.sqrt(20.0 + Math.pow(lBar - 50.0, 2));
  const sC = 1.0 + 0.045 * cBarPrime;
  const sH = 1.0 + 0.015 * cBarPrime * t;

  const pow7CBarPrime = Math.pow(cBarPrime, 7);
  const rT =
    -2.0 *
    Math.sqrt(pow7CBarPrime / (pow7CBarPrime + POW7_25)) *
    Math.sin(degreeToRadian(60.0 * Math.exp(-1.0 * Math.pow((hBarPrime - 275.0) / 25.0, 2))));

  const l = deltaLPrime / (kL * sL);
  const c = deltaCPrime / (kC * sC);
  const h = deltaHPrime / (kH * sH);

  const squared = l ** 2 + c ** 2 + h ** 2 + rT * c * h;
  return Math.sqrt(squared) as ColorDifference;
};
