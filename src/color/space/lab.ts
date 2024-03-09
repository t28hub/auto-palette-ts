import { clamp } from '../../math';
import type { LAB, XYZ } from '../types';

import { assertFiniteNumber } from '../../utils';
import { D65, clampX, clampY, clampZ } from './xyz';

/**
 * The minimum value of the 'l' component.
 *
 * @public
 * @see {@link MAX_L}
 * @see {@link clampL}
 */
export const MIN_L = 0;

/**
 * The maximum value of the 'l' component.
 *
 * @public
 * @see {@link MIN_L}
 * @see {@link clampL}
 */
export const MAX_L = 100;

/**
 * The minimum value of the 'a' component.
 *
 * @public
 * @see {@link MAX_A}
 * @see {@link clampA}
 */
export const MIN_A = -128;

/**
 * The maximum value of the 'a' component.
 *
 * @public
 * @see {@link MIN_A}
 * @see {@link clampA}
 */
export const MAX_A = 128;

/**
 * The minimum value of the 'b' component.
 *
 * @public
 * @see {@link MAX_B}
 * @see {@link clampB}
 */
export const MIN_B = -128;

/**
 * The maximum value of the 'b' component.
 *
 * @public
 * @see {@link MIN_B}
 * @see {@link clampB}
 */
export const MAX_B = 128;

/**
 * Clamp the 'l' component of the color.
 *
 * @param value The 'l' component of the color.
 * @returns The clamped 'l' component.
 * @see {@link clampA}
 * @see {@link clampB}
 */
export function clampL(value: number): number {
  return clamp(value, MIN_L, MAX_L);
}

/**
 * Clamp the 'a' component of the color.
 *
 * @param value The 'a' component of the color.
 * @returns The clamped 'a' component.
 * @see {@link clampL}
 * @see {@link clampB}
 */
export function clampA(value: number): number {
  return clamp(value, MIN_A, MAX_A);
}

/**
 * Clamp the 'b' component of the color.
 *
 * @param value The 'b' component of the color.
 * @returns The clamped 'b' component.
 * @see {@link clampL}
 * @see {@link clampA}
 */
export function clampB(value: number): number {
  return clamp(value, MIN_B, MAX_B);
}

/**
 * Convert a color from the XYZ color space to the CIELab color space.
 *
 * @param xyz - The color in the XYZ color space.
 * @returns The converted color in the CIELab color space.
 * @throws {TypeError} If any of the XYZ components is not a finite number.
 * @see {@link toXYZ}
 */
export function fromXYZ({ x, y, z }: XYZ): LAB {
  assertFiniteNumber(x, `The x(${x}) must be a finite number`);
  assertFiniteNumber(y, `The y(${y}) must be a finite number`);
  assertFiniteNumber(z, `The z(${z}) must be a finite number`);

  // Function to covert a component of XYZ to CIELab.
  const epsilon = (6.0 / 29.0) ** 3.0;
  const kappa = 841.0 / 108.0;
  const delta = 4.0 / 29.0;
  const f = (t: number): number => {
    if (t > epsilon) {
      return Math.cbrt(t);
    }
    return kappa * t + delta;
  };

  const fx = f(x / D65.x);
  const fy = f(y / D65.y);
  const fz = f(z / D65.z);

  const l = clampL(116.0 * fy - 16.0);
  const a = clampA(500.0 * (fx - fy));
  const b = clampB(200.0 * (fy - fz));
  return { l, a, b };
}

/**
 * Convert a color from CIELab color space to the RGB color space.
 *
 * @param lab - The color in the CIELab color space.
 * @returns The converted color in the RGB color space.
 * @throws {TypeError} If any of the CIELab components is not a finite number.
 * @see {@link fromXYZ}
 */
export function toXYZ({ l, a, b }: LAB): XYZ {
  assertFiniteNumber(l, `The l(${l}) must be a finite number`);
  assertFiniteNumber(a, `The a(${a}) must be a finite number`);
  assertFiniteNumber(b, `The b(${b}) must be a finite number`);

  // Function to covert a component of CIELab to XYZ.
  const epsilon = 6.0 / 29.0;
  const kappa = 108.0 / 841.0;
  const delta = 4.0 / 29.0;
  const f = (t: number): number => {
    if (t > epsilon) {
      return t ** 3.0;
    }
    return kappa * (t - delta);
  };

  const l2 = (clampL(l) + 16.0) / 116.0;
  const a2 = clampA(a) / 500.0;
  const b2 = clampB(b) / 200.0;

  const x = clampX(D65.x * f(l2 + a2));
  const y = clampY(D65.y * f(l2));
  const z = clampZ(D65.z * f(l2 - b2));
  return { x, y, z };
}
