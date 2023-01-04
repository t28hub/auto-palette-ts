import { clamp } from '../../math';
import { ColorSpace, PackedColor, RGB } from '../../types';

import { asPackedColor } from './utils';

const MIN_RGB = 0x00;
const MAX_RGB = 0xff;

const SHIFT_R = 24;
const SHIFT_G = 16;
const SHIFT_B = 8;
const SHIFT_A = 0;

/**
 * The RGB color space implementation.
 */
export class RGBColorSpace implements ColorSpace<RGB> {
  encode(color: RGB): PackedColor {
    const r = RGBColorSpace.clampValue(color.r);
    const g = RGBColorSpace.clampValue(color.g);
    const b = RGBColorSpace.clampValue(color.b);

    const opacity = clamp(color.opacity, 0.0, 1.0);
    const a = Math.round(opacity * MAX_RGB);

    // Force conversion to uint32.
    const packed =
      ((r << SHIFT_R) | (g << SHIFT_G) | (b << SHIFT_B) | (a << SHIFT_A)) >>> 0;
    return asPackedColor(packed);
  }

  decode(value: PackedColor): RGB {
    const r = (value >> SHIFT_R) & MAX_RGB;
    const g = (value >> SHIFT_G) & MAX_RGB;
    const b = (value >> SHIFT_B) & MAX_RGB;
    const a = (value >> SHIFT_A) & MAX_RGB;
    const opacity = a / MAX_RGB;
    return { r, g, b, opacity };
  }

  /**
   * Clamp the value as valid value of RGB.
   *
   * @param value The value to be clamped.
   * @return The clamped value.
   */
  static clampValue(value: number): number {
    if (!Number.isFinite(value)) {
      return MIN_RGB;
    }
    return clamp(value, MIN_RGB, MAX_RGB);
  }
}
