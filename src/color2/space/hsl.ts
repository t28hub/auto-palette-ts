import { clamp } from '../../math';
import { HSL, RGB } from '../types';

import { RGBSpace } from './rgb';

/**
 * Class representing operations in the HSL color space.
 */
export class HSLSpace {
  /**
   * The minimum value of the hue component.
   */
  static readonly MIN_H = 0.0;

  /**
   * The maximum value of the hue component.
   */
  static readonly MAX_H = 360.0;

  /**
   * The minimum value of the saturation component.
   */
  static readonly MIN_S = 0.0;

  /**
   * The maximum value of the saturation component.
   */
  static readonly MAX_S = 1.0;

  /**
   * The minimum value of the lightness component.
   */
  static readonly MIN_L = 0.0;

  /**
   * The maximum value of the lightness component.
   */
  static readonly MAX_L = 1.0;

  /**
   * Normalize the hue component of the color.
   * The hue component is normalized to the range [0, 360).
   *
   * @param value The hue component of the color.
   * @returns The normalized hue component.
   * @see {@link clampS}
   * @see {@link clampL}
   */
  static normalizeH(value: number): number {
    return ((value % HSLSpace.MAX_H) + HSLSpace.MAX_H) % HSLSpace.MAX_H;
  }

  /**
   * Clamp the saturation component of the color.
   * The saturation component is clamped to the range [0, 1].
   *
   * @param value The saturation component of the color.
   * @returns The clamped saturation component.
   * @see {@link clampH}
   * @see {@link clampL}
   */
  static clampS(value: number): number {
    return clamp(value, HSLSpace.MIN_S, HSLSpace.MAX_S);
  }

  /**
   * Clamp the lightness component of the color.
   * The lightness component is clamped to the range [0, 1].
   *
   * @param value The lightness component of the color.
   * @returns The clamped lightness component.
   * @see {@link clampH}
   * @see {@link clampS}
   */
  static clampL(value: number): number {
    return clamp(value, HSLSpace.MIN_L, HSLSpace.MAX_L);
  }

  /**
   * Convert a color from the HSL color space to the RGB color space.
   *
   * @param rgb - The color in the RGB color space.
   * @returns The converted color in the RGB color space.
   * @throws {TypeError} If the r, g, or b is not finite number.
   * @see {@link toRGB}
   */
  static fromRGB(rgb: RGB): HSL {
    if (!Number.isFinite(rgb.r) || !Number.isFinite(rgb.g) || !Number.isFinite(rgb.b)) {
      throw new TypeError(`The r, g, and b components must be finite numbers: ${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // Normalize the RGB values.
    const r = RGBSpace.clampValue(rgb.r) / RGBSpace.MAX_RGB;
    const g = RGBSpace.clampValue(rgb.g) / RGBSpace.MAX_RGB;
    const b = RGBSpace.clampValue(rgb.b) / RGBSpace.MAX_RGB;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }

    const l = (max + min) / 2.0;

    let s = 0.0;
    if (delta !== 0) {
      s = delta / (1.0 - Math.abs(2.0 * l - 1.0));
    }

    return {
      h: HSLSpace.normalizeH(h),
      s: HSLSpace.clampS(s),
      l: HSLSpace.clampL(l),
    };
  }

  /**
   * Convert a color from the HSL color space to the RGB color space.
   *
   * @param hsl - The color in the HSL color space.
   * @returns The converted color in the RGB color space.
   * @throws {TypeError} If the h, s, or l is not finite number.
   * @see {@link fromRGB}
   */
  static toRGB(hsl: HSL): RGB {
    if (!Number.isFinite(hsl.h) || !Number.isFinite(hsl.s) || !Number.isFinite(hsl.l)) {
      throw new TypeError(`The h, s, and l components must be finite numbers: ${hsl.h}, ${hsl.s}, ${hsl.l}`);
    }

    const h = HSLSpace.normalizeH(hsl.h);
    const s = HSLSpace.clampS(hsl.s);
    const l = HSLSpace.clampL(hsl.l);

    const c = (1.0 - Math.abs(2.0 * l - 1.0)) * s;
    const x = (1.0 - Math.abs(((h / 60) % 2) - 1.0)) * c;
    const m = l - c / 2.0;

    let [r, g, b] = [0.0, 0.0, 0.0];
    if (0 <= h && h < 60) {
      r = c;
      g = x;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
    } else if (120 <= h && h < 180) {
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      b = x;
    }

    return {
      r: RGBSpace.clampValue((r + m) * RGBSpace.MAX_RGB),
      g: RGBSpace.clampValue((g + m) * RGBSpace.MAX_RGB),
      b: RGBSpace.clampValue((b + m) * RGBSpace.MAX_RGB),
    };
  }
}
