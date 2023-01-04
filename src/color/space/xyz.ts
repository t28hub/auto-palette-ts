import { clamp } from '../../math';
import { ColorSpace, XYZ, PackedColor, RGB } from '../../types';

import { RGBColorSpace } from './rgb';

/**
 * White point.
 *
 * @see [White point](https://en.wikipedia.org/wiki/White_point)
 */
export type WhitePoint = Omit<XYZ, 'opacity'>;

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
const MIN_Y = 0.0;
const MIN_Z = 0.0;

const MAX_X = 0.950456;
const MAX_Y = 1.0;
const MAX_Z = 1.088644;

/**
 * The CIE XYZ color space implementation.
 */
export class XYZColorSpace implements ColorSpace<XYZ> {
  /**
   * Create a new XYZColorSpace.
   *
   * @param rgbColorSpace The rgb color space.
   */
  constructor(
    private readonly rgbColorSpace: ColorSpace<RGB> = new RGBColorSpace(),
  ) {}

  encode(color: XYZ): PackedColor {
    const x = XYZColorSpace.clampX(color.x);
    const y = XYZColorSpace.clampY(color.y);
    const z = XYZColorSpace.clampZ(color.z);

    const f = (value: number): number => {
      if (value <= 0.0031308) {
        return 12.92 * value;
      }
      return 1.055 * Math.pow(value, 1.0 / 2.4) - 0.055;
    };

    const fr = f(3.24097 * x - 1.537383 * y - 0.498611 * z);
    const fg = f(-0.969244 * x + 1.875968 * y + 0.041555 * z);
    const fb = f(0.05563 * x - 0.203977 * y + 1.056972 * z);

    const r = RGBColorSpace.clampValue(Math.round(fr * 0xff));
    const g = RGBColorSpace.clampValue(Math.round(fg * 0xff));
    const b = RGBColorSpace.clampValue(Math.round(fb * 0xff));
    return this.rgbColorSpace.encode({ r, g, b, opacity: color.opacity });
  }

  decode(packed: PackedColor): XYZ {
    const f = (value: number): number => {
      if (value <= 0.04045) {
        return value / 12.92;
      }
      return Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const rgb = this.rgbColorSpace.decode(packed);
    const fr = f(rgb.r / 0xff);
    const fg = f(rgb.g / 0xff);
    const fb = f(rgb.b / 0xff);

    const x = XYZColorSpace.clampX(
      0.412391 * fr + 0.357584 * fg + 0.180481 * fb,
    );
    const y = XYZColorSpace.clampY(
      0.212639 * fr + 0.715169 * fg + 0.072192 * fb,
    );
    const z = XYZColorSpace.clampZ(
      0.019331 * fr + 0.119195 * fg + 0.950532 * fb,
    );
    return { x, y, z, opacity: rgb.opacity };
  }

  /**
   * Clamp the value as X.
   *
   * @param value The value to be clamped.
   * @return The clamped X value.
   *
   * @see clampY
   * @see clampZ
   */
  static clampX(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_X;
    }
    return clamp(value, MIN_X, MAX_X);
  }

  /**
   * Clamp the value as Y.
   *
   * @param value The value to be clamped.
   * @return The clamped Y value.
   *
   * @see clampX
   * @see clampZ
   */
  static clampY(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_Y;
    }
    return clamp(value, MIN_Y, MAX_Y);
  }

  /**
   * Clamp the value as Z.
   *
   * @param value The value to be clamped.
   * @return The clamped Z value.
   *
   * @see clampX
   * @see clampY
   */
  static clampZ(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_Z;
    }
    return clamp(value, MIN_Z, MAX_Z);
  }
}
