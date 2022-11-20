import { clamp } from '../../math';

import { Model, Opacity, PackedColor } from './model';
import { D65, XYZ } from './xyz';

// [Range of coordinates](https://en.wikipedia.org/wiki/CIELAB_color_space#Range_of_coordinates)
const MIN_L = 0;
const MAX_L = 100;

/**
 * Clamp the given value to lightness.
 *
 * @param value The value to be clamped.
 * @return The clamped value.
 */
export function clampL(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_L;
  }
  return clamp(value, MIN_L, MAX_L);
}

const MIN_A = -128;
const MAX_A = 127;

/**
 * Clamp the given value to a.
 *
 * @param value The value to be clamped.
 * @return The clamped value.
 */
export function clampA(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_A;
  }
  return clamp(value, MIN_A, MAX_A);
}

const MIN_B = -128;
const MAX_B = 127;

/**
 * Clamp the given value to b.
 *
 * @param value The value to be clamped.
 * @return The clamped value.
 */
export function clampB(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_B;
  }
  return clamp(value, MIN_B, MAX_B);
}

/**
 * The type representing a color in CIE L*a*b*.
 */
export type LabColor = {
  /**
   * The lightness value.
   */
  readonly l: number;

  /**
   * The a value.
   */
  readonly a: number;

  /**
   * The b value.
   */
  readonly b: number;
} & Opacity;

const DELTA = 6.0 / 29.0;

/**
 * The CIE L*a*b* color model implementation.
 *
 * [CIELAB color space](https://en.wikipedia.org/wiki/CIELAB_color_space#From_CIEXYZ_to_CIELAB)
 */
export const Lab: Model<LabColor> = {
  pack(color: LabColor): PackedColor {
    const l = clampL(color.l);
    const a = clampA(color.a);
    const b = clampB(color.b);

    const l2 = (l + 16.0) / 116.0;
    const a2 = a / 500.0;
    const b2 = b / 200.0;

    const f = (t: number): number => {
      if (t > DELTA) {
        return Math.pow(t, 3.0);
      }
      return 3.0 * DELTA * DELTA * (t - 4.0 / 29.0);
    };

    const x = D65.x * f(l2 + a2);
    const y = D65.y * f(l2);
    const z = D65.z * f(l2 - b2);
    return XYZ.pack({ x, y, z, opacity: color.opacity });
  },
  unpack(packed: PackedColor): LabColor {
    const f = (t: number): number => {
      if (t > Math.pow(DELTA, 3.0)) {
        return Math.cbrt(t);
      }
      return (Math.pow(29.0 / 6.0, 2.0) / 3.0) * t + 4.0 / 29.0;
    };

    const xyz = XYZ.unpack(packed);
    const fx = f(xyz.x / D65.x);
    const fy = f(xyz.y / D65.y);
    const fz = f(xyz.z / D65.z);

    const l = clampL(116.0 * fy - 16.0);
    const a = clampA(500.0 * (fx - fy));
    const b = clampB(200.0 * (fy - fz));
    return { l, a, b, opacity: xyz.opacity };
  },
} as const;
