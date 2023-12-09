import { clamp } from '../../math';
import { LAB, XYZ } from '../types';

import { D65, XYZSpace } from './xyz';

/**
 * Class representing operations in the CIELab color space.
 */
export class CIELabSpace {
  /**
   * The minimum value of the 'l' component.
   */
  static readonly MIN_L = 0;

  /**
   * The maximum value of the 'l' component.
   */
  static readonly MAX_L = 100;

  /**
   * The minimum value of the 'a' component.
   */
  static readonly MIN_A = -128;

  /**
   * The maximum value of the 'a' component.
   */
  static readonly MAX_A = 128;

  /**
   * The minimum value of the 'b' component.
   */
  static readonly MIN_B = -128;

  /**
   * The maximum value of the 'b' component.
   */
  static readonly MAX_B = 128;

  /**
   * Clamp the 'l' component of the color.
   *
   * @param value The 'l' component of the color.
   * @returns The clamped 'l' component.
   * @see {@link clampA}
   * @see {@link clampB}
   */
  static clampL(value: number): number {
    return clamp(value, CIELabSpace.MIN_L, CIELabSpace.MAX_L);
  }

  /**
   * Clamp the 'a' component of the color.
   *
   * @param value The 'a' component of the color.
   * @returns The clamped 'a' component.
   * @see {@link clampL}
   * @see {@link clampB}
   */
  static clampA(value: number): number {
    return clamp(value, CIELabSpace.MIN_A, CIELabSpace.MAX_A);
  }

  /**
   * Clamp the 'b' component of the color.
   *
   * @param value The 'b' component of the color.
   * @returns The clamped 'b' component.
   * @see {@link clampL}
   * @see {@link clampA}
   */
  static clampB(value: number): number {
    return clamp(value, CIELabSpace.MIN_B, CIELabSpace.MAX_B);
  }

  /**
   * Convert a color from the XYZ color space to the CIELab color space.
   *
   * @param xyz - The color in the XYZ color space.
   * @returns The converted color in the CIELab color space.
   * @throws {TypeError} If any of the XYZ components is not a finite number.
   * @see {@link toXYZ}
   */
  static fromXYZ({ x, y, z }: XYZ): LAB {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new TypeError(`The x, y, and z components must be finite numbers: ${x}, ${y}, ${z}`);
    }

    // Function to covert a component of XYZ to CIELab.
    const epsilon = Math.pow(6.0 / 29.0, 3.0);
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

    const l = this.clampL(116.0 * fy - 16.0);
    const a = this.clampA(500.0 * (fx - fy));
    const b = this.clampB(200.0 * (fy - fz));
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
  static toXYZ({ l, a, b }: LAB): XYZ {
    if (!Number.isFinite(l) || !Number.isFinite(a) || !Number.isFinite(b)) {
      throw new TypeError(`The l, a, and b components must be finite numbers: ${l}, ${a}, ${b}`);
    }

    // Function to covert a component of CIELab to XYZ.
    const epsilon = 6.0 / 29.0;
    const kappa = 108.0 / 841.0;
    const delta = 4.0 / 29.0;
    const f = (t: number): number => {
      if (t > epsilon) {
        return Math.pow(t, 3.0);
      }
      return kappa * (t - delta);
    };

    const l2 = (this.clampL(l) + 16.0) / 116.0;
    const a2 = this.clampA(a) / 500.0;
    const b2 = this.clampB(b) / 200.0;

    const x = XYZSpace.clampX(D65.x * f(l2 + a2));
    const y = XYZSpace.clampY(D65.y * f(l2));
    const z = XYZSpace.clampZ(D65.z * f(l2 - b2));
    return { x, y, z };
  }
}
