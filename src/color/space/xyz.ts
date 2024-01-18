import { clamp } from '../../math';
import { RGB, XYZ } from '../types';

import { assertFiniteNumber, assertInteger } from '../../utils';
import { MAX_RGB, clampValue } from './rgb';

/**
 * The minimum value of the 'x' component.
 *
 * @see {@link MAX_X}
 * @see {@link clampX}
 */
const MIN_X = 0.0;

/**
 * The maximum value of the 'x' component.
 *
 * @see {@link MIN_X}
 * @see {@link clampX}
 */
const MAX_X = 0.950456;

/**
 * The minimum value of the 'y' component.
 *
 * @see {@link MAX_Y}
 * @see {@link clampY}
 */
const MIN_Y = 0.0;

/**
 * The maximum value of the 'y' component.
 *
 * @see {@link MIN_Y}
 * @see {@link clampY}
 */
const MAX_Y = 1.0;

/**
 * The minimum value of the 'z' component.
 *
 * @see {@link MAX_Z}
 * @see {@link clampZ}
 */
const MIN_Z = 0.0;

/**
 * The maximum value of the 'z' component.
 *
 * @see {@link MIN_Z}
 * @see {@link clampZ}
 */
const MAX_Z = 1.088644;

/**
 * Clamp the 'x' component of the color.
 *
 * @param value The x component of the color.
 * @returns The clamped x component.
 * @see {@link clampY}
 * @see {@link clampZ}
 */
export function clampX(value: number): number {
  return clamp(value, MIN_X, MAX_X);
}

/**
 * Clamp the 'y' component of the color.
 *
 * @param value The y component of the color.
 * @returns The clamped y component.
 * @see {@link clampX}
 * @see {@link clampZ}
 */
export function clampY(value: number): number {
  return clamp(value, MIN_Y, MAX_Y);
}

/**
 * Clamp the 'z' component of the color.
 *
 * @param value The z component of the color.
 * @returns The clamped z component.
 * @see {@link clampX}
 * @see {@link clampY}
 */
export function clampZ(value: number): number {
  return clamp(value, MIN_Z, MAX_Z);
}

/**
 * The D65 illuminant in the CIE XYZ color space.
 *
 * @see [Illuminant D65 - Wikipedia](https://en.wikipedia.org/wiki/Illuminant_D65#Definition)
 */
export const D65: XYZ = {
  x: 0.95047,
  y: 1.0,
  z: 1.08883,
} as const;

/**
 * Convert a color from the RGB color space to the XYZ color space.
 *
 * @param rgb - The color in the RGB color space.
 * @returns The converted color in the XYZ color space.
 * @see {@link toRGB}
 */
export function fromRGB({ r, g, b }: RGB): XYZ {
  assertInteger(r, `The r(${r}) must be an integer`);
  assertInteger(g, `The g(${g}) must be an integer`);
  assertInteger(b, `The b(${b}) must be an integer`);

  const f = (value: number): number => {
    if (value <= 0.04045) {
      return value / 12.92;
    }
    return ((value + 0.055) / 1.055) ** 2.4;
  };

  const fr = f(r / MAX_RGB);
  const fg = f(g / MAX_RGB);
  const fb = f(b / MAX_RGB);

  const x = clampX(0.412391 * fr + 0.357584 * fg + 0.180481 * fb);
  const y = clampY(0.212639 * fr + 0.715169 * fg + 0.072192 * fb);
  const z = clampZ(0.019331 * fr + 0.119195 * fg + 0.950532 * fb);
  return { x, y, z };
}

/**
 * Convert a color from the XYZ color space to the RGB color space.
 *
 * @param xyz - The color in the XYZ color space.
 * @returns The converted color in the RGB color space.
 * @throws {TypeError} If any of the XYZ components is not a finite number.
 * @see {@link fromRGB}
 */
export function toRGB({ x, y, z }: XYZ): RGB {
  assertFiniteNumber(x, `The x(${x}) must be a finite number`);
  assertFiniteNumber(y, `The y(${y}) must be a finite number`);
  assertFiniteNumber(z, `The z(${z}) must be a finite number`);

  const f = (value: number): number => {
    if (value <= 0.0031308) {
      return 12.92 * value;
    }
    return 1.055 * value ** (1.0 / 2.4) - 0.055;
  };

  const fr = f(3.24097 * x - 1.537383 * y - 0.498611 * z);
  const fg = f(-0.969244 * x + 1.875968 * y + 0.041555 * z);
  const fb = f(0.05563 * x - 0.203977 * y + 1.056972 * z);

  const r = clampValue(Math.round(fr * MAX_RGB));
  const g = clampValue(Math.round(fg * MAX_RGB));
  const b = clampValue(Math.round(fb * MAX_RGB));
  return { r, g, b };
}
