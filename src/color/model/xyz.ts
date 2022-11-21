import { clamp } from '../../math';

import { Model, Opacity, PackedColor } from './model';
import { clampValue, RGB } from './rgb';

/**
 * The type representing a color in CIE XYZ.
 */
export type XYZColor = {
  /**
   * The x value.
   */
  readonly x: number;

  /**
   * The y value.
   */
  readonly y: number;

  /**
   * The z value.
   */
  readonly z: number;
} & Opacity;

/**
 * White point.
 *
 * @see [White point](https://en.wikipedia.org/wiki/White_point)
 */
export type WhitePoint = Omit<XYZColor, 'opacity'>;

/**
 * CIE standard illuminant D65.
 *
 * @see [Illuminant D65 - Wikipedia](https://en.wikipedia.org/wiki/Illuminant_D65#Definition)
 */
export const D65: WhitePoint = {
  x: 0.95046,
  y: 1.0,
  z: 1.08906,
} as const;

const MIN_X = 0.0;
const MAX_X = 0.950456;

/**
 * Clamp the value as X.
 *
 * @param value The value to be clamped.
 * @return The clamped X value.
 *
 * @see clampY
 * @see clampZ
 */
export function clampX(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_X;
  }
  return clamp(value, MIN_X, MAX_X);
}

const MIN_Y = 0.0;
const MAX_Y = 1.0;

/**
 * Clamp the value as Y.
 *
 * @param value The value to be clamped.
 * @return The clamped Y value.
 *
 * @see clampX
 * @see clampZ
 */
export function clampY(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_Y;
  }
  return clamp(value, MIN_Y, MAX_Y);
}

const MIN_Z = 0.0;
const MAX_Z = 1.088644;

/**
 * Clamp the value as Z.
 *
 * @param value The value to be clamped.
 * @return The clamped Z value.
 *
 * @see clampX
 * @see clampY
 */
export function clampZ(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_Z;
  }
  return clamp(value, MIN_Z, MAX_Z);
}

/**
 * The CIE XYZ color model implementation.
 */
export const XYZ: Model<XYZColor> = {
  pack(color: XYZColor): PackedColor {
    const x = clampX(color.x);
    const y = clampY(color.y);
    const z = clampZ(color.z);

    const f = (value: number): number => {
      if (value <= 0.0031308) {
        return 12.92 * value;
      }
      return 1.055 * Math.pow(value, 1.0 / 2.4) - 0.055;
    };

    const fr = f(3.24097 * x - 1.537383 * y - 0.498611 * z);
    const fg = f(-0.969244 * x + 1.875968 * y + 0.041555 * z);
    const fb = f(0.05563 * x - 0.203977 * y + 1.056972 * z);

    const r = clampValue(Math.round(fr * 0xff));
    const g = clampValue(Math.round(fg * 0xff));
    const b = clampValue(Math.round(fb * 0xff));
    return RGB.pack({ r, g, b, opacity: color.opacity });
  },
  unpack(packed: PackedColor): XYZColor {
    const f = (value: number): number => {
      if (value <= 0.04045) {
        return value / 12.92;
      }
      return Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const rgb = RGB.unpack(packed);
    const fr = f(rgb.r / 0xff);
    const fg = f(rgb.g / 0xff);
    const fb = f(rgb.b / 0xff);

    const x = clampX(0.412391 * fr + 0.357584 * fg + 0.180481 * fb);
    const y = clampY(0.212639 * fr + 0.715169 * fg + 0.072192 * fb);
    const z = clampZ(0.019331 * fr + 0.119195 * fg + 0.950532 * fb);
    return { x, y, z, opacity: rgb.opacity };
  },
};
