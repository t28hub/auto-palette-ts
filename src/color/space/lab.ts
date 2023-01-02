import { clamp } from '../../math';
import { ColorSpace, Lab, PackedColor, XYZ } from '../../types';

import { WhitePoint, XYZColorSpace } from './xyz';

export const MIN_L = 0;
export const MIN_A = -128;
export const MIN_B = -128;

export const MAX_L = 100;
export const MAX_A = 127;
export const MAX_B = 127;

const DELTA = 6.0 / 29.0;

/**
 * The CIE L*a*b* color space implementation.
 *
 * [CIELAB color space](https://en.wikipedia.org/wiki/CIELAB_color_space#From_CIEXYZ_to_CIELAB)
 * [Range of coordinates](https://en.wikipedia.org/wiki/CIELAB_color_space#Range_of_coordinates)
 */
export class LabColorSpace implements ColorSpace<Lab> {
  /**
   * Create a new LabColorSpace.
   *
   * @param whitePoint The white point.
   * @param xyzColorSpace The XYZ color space.
   */
  constructor(
    private readonly whitePoint: WhitePoint,
    private readonly xyzColorSpace: ColorSpace<XYZ> = new XYZColorSpace(),
  ) {}

  encode(color: Lab): PackedColor {
    const l = LabColorSpace.clampL(color.l);
    const a = LabColorSpace.clampA(color.a);
    const b = LabColorSpace.clampB(color.b);

    const l2 = (l + 16.0) / 116.0;
    const a2 = a / 500.0;
    const b2 = b / 200.0;

    const f = (t: number): number => {
      if (t > DELTA) {
        return Math.pow(t, 3.0);
      }
      return 3.0 * DELTA * DELTA * (t - 4.0 / 29.0);
    };

    const x = this.whitePoint.x * f(l2 + a2);
    const y = this.whitePoint.y * f(l2);
    const z = this.whitePoint.z * f(l2 - b2);
    return this.xyzColorSpace.encode({ x, y, z, opacity: color.opacity });
  }

  decode(packed: PackedColor): Lab {
    const f = (t: number): number => {
      if (t > Math.pow(DELTA, 3.0)) {
        return Math.cbrt(t);
      }
      return (Math.pow(29.0 / 6.0, 2.0) / 3.0) * t + 4.0 / 29.0;
    };

    const xyz = this.xyzColorSpace.decode(packed);
    const fx = f(xyz.x / this.whitePoint.x);
    const fy = f(xyz.y / this.whitePoint.y);
    const fz = f(xyz.z / this.whitePoint.z);

    const l = LabColorSpace.clampL(116.0 * fy - 16.0);
    const a = LabColorSpace.clampA(500.0 * (fx - fy));
    const b = LabColorSpace.clampB(200.0 * (fy - fz));
    return { l, a, b, opacity: xyz.opacity };
  }

  /**
   * Clamp the given value to lightness.
   *
   * @param value The value to be clamped.
   * @return The clamped value.
   *
   * @see clampA
   * @see clampB
   */
  static clampL(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_L;
    }
    return clamp(value, MIN_L, MAX_L);
  }

  /**
   * Clamp the given value to a.
   *
   * @param value The value to be clamped.
   * @return The clamped value.
   *
   * @see clampL
   * @see clampB
   */
  static clampA(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_A;
    }
    return clamp(value, MIN_A, MAX_A);
  }

  /**
   * Clamp the given value to b.
   *
   * @param value The value to be clamped.
   * @return The clamped value.
   *
   * @see clampA
   * @see clampB
   */
  static clampB(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_B;
    }
    return clamp(value, MIN_B, MAX_B);
  }
}
