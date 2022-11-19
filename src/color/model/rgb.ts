import { clamp } from '../../math';

import { asPackedColor, Model, Opacity, PackedColor } from './model';

/**
 * The type representing a color in RGB.
 */
export type RGBColor = {
  /**
   * The red value.
   */
  readonly r: number;

  /**
   * The green value.
   */
  readonly g: number;

  /**
   * The blue value.
   */
  readonly b: number;
} & Opacity;

const MIN_RGB = 0x00;
const MAX_RGB = 0xff;

const SHIFT_R = 24;
const SHIFT_G = 16;
const SHIFT_B = 8;
const SHIFT_A = 0;

/**
 * The RGB color model implementation.
 */
export const RGB: Model<RGBColor> = {
  pack(color: RGBColor): PackedColor {
    const r = clamp(color.r, MIN_RGB, MAX_RGB);
    const g = clamp(color.g, MIN_RGB, MAX_RGB);
    const b = clamp(color.b, MIN_RGB, MAX_RGB);

    const opacity = clamp(color.opacity, 0.0, 1.0);
    const a = Math.round(opacity * MAX_RGB);

    // Force conversion to uint32.
    const packed = ((r << SHIFT_R) | (g << SHIFT_G) | (b << SHIFT_B) | (a << SHIFT_A)) >>> 0;
    return asPackedColor(packed);
  },
  unpack(value: PackedColor): RGBColor {
    const r = (value >> SHIFT_R) & MAX_RGB;
    const g = (value >> SHIFT_G) & MAX_RGB;
    const b = (value >> SHIFT_B) & MAX_RGB;
    const a = (value >> SHIFT_A) & MAX_RGB;
    const opacity = a / MAX_RGB;
    return { r, g, b, opacity };
  },
} as const;
