import { clamp } from '../../math';

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
}
