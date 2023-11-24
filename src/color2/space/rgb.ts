import { clamp } from '../../math';
import { RGB } from '../types';

/**
 * Class representing operations in the RGB color space.
 */
export class RGBSpace {
  /**
   * The minimum value of the RGB component.
   */
  static readonly MIN_RGB = 0x00;

  /**
   * The maximum value of the RGB component.
   */
  static readonly MAX_RGB = 0xff;

  /**
   * Clamp the RGB component of the color.
   *
   * @param value The RGB component of the color.
   * @returns The clamped RGB component.
   */
  static clampValue(value: number): number {
    return clamp(value, RGBSpace.MIN_RGB, RGBSpace.MAX_RGB);
  }

  /**
   * Convert a color from the RGB color space to the hexadecimal string.
   *
   * @param r The red component of the color.
   * @param g The green component of the color.
   * @param b The blue component of the color.
   * @returns The hexadecimal string.
   * @throws {TypeError} If the r, g, or b is not finite number.
   */
  static toHexString({ r, g, b }: RGB): string {
    return [r, g, b].reduce((string, value) => {
      if (!Number.isFinite(value)) {
        throw new TypeError(`The r, g, and b components must be finite numbers: ${r}, ${g}, ${b}`);
      }
      const hex = this.clampValue(value).toString(16).padStart(2, '0');
      return string + hex;
    }, '#');
  }
}
