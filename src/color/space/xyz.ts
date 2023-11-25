import { clamp } from '../../math';
import { RGB, XYZ } from '../types';

import { RGBSpace } from './rgb';

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

export class XYZSpace {
  /**
   * The minimum value of the x component.
   */
  static readonly MIN_X = 0.0;

  /**
   * The maximum value of the x component.
   */
  static readonly MAX_X = 0.950456;

  /**
   * The minimum value of the y component.
   */
  static readonly MIN_Y = 0.0;

  /**
   * The maximum value of the y component.
   */
  static readonly MAX_Y = 1.0;

  /**
   * The minimum value of the z component.
   */
  static readonly MIN_Z = 0.0;

  /**
   * The maximum value of the z component.
   */
  static readonly MAX_Z = 1.088644;

  /**
   * Clamp the x component of the color.
   *
   * @param value The x component of the color.
   * @returns The clamped x component.
   * @see {@link clampY}
   * @see {@link clampZ}
   */
  static clampX(value: number): number {
    return clamp(value, XYZSpace.MIN_X, XYZSpace.MAX_X);
  }

  /**
   * Clamp the y component of the color.
   *
   * @param value The y component of the color.
   * @returns The clamped y component.
   * @see {@link clampX}
   * @see {@link clampZ}
   */
  static clampY(value: number): number {
    return clamp(value, XYZSpace.MIN_Y, XYZSpace.MAX_Y);
  }

  /**
   * Clamp the z component of the color.
   *
   * @param value The z component of the color.
   * @returns The clamped z component.
   * @see {@link clampX}
   * @see {@link clampY}
   */
  static clampZ(value: number): number {
    return clamp(value, XYZSpace.MIN_Z, XYZSpace.MAX_Z);
  }

  /**
   * Convert a color from the RGB color space to the XYZ color space.
   *
   * @param rgb - The color in the RGB color space.
   * @returns The converted color in the XYZ color space.
   * @throws {TypeError} If any of the RGB components is not a finite number.
   * @see {@link toRGB}
   */
  static fromRGB({ r, g, b }: RGB): XYZ {
    if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) {
      throw new TypeError(`The r, g, and b components must be finite numbers: ${r}, ${g}, ${b}`);
    }

    const f = (value: number): number => {
      if (value <= 0.04045) {
        return value / 12.92;
      }
      return Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const fr = f(r / RGBSpace.MAX_RGB);
    const fg = f(g / RGBSpace.MAX_RGB);
    const fb = f(b / RGBSpace.MAX_RGB);

    const x = this.clampX(0.412391 * fr + 0.357584 * fg + 0.180481 * fb);
    const y = this.clampY(0.212639 * fr + 0.715169 * fg + 0.072192 * fb);
    const z = this.clampZ(0.019331 * fr + 0.119195 * fg + 0.950532 * fb);
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
  static toRGB({ x, y, z }: XYZ): RGB {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new TypeError(`The x, y, and z components must be finite numbers: ${x}, ${y}, ${z}`);
    }

    const f = (value: number): number => {
      if (value <= 0.0031308) {
        return 12.92 * value;
      }
      return 1.055 * Math.pow(value, 1.0 / 2.4) - 0.055;
    };

    const fr = f(3.24097 * x - 1.537383 * y - 0.498611 * z);
    const fg = f(-0.969244 * x + 1.875968 * y + 0.041555 * z);
    const fb = f(0.05563 * x - 0.203977 * y + 1.056972 * z);

    const r = RGBSpace.clampValue(Math.round(fr * RGBSpace.MAX_RGB));
    const g = RGBSpace.clampValue(Math.round(fg * RGBSpace.MAX_RGB));
    const b = RGBSpace.clampValue(Math.round(fb * RGBSpace.MAX_RGB));
    return { r, g, b };
  }
}
