import { clamp } from '../../math';

import { Model, Opacity, PackedColor } from './model';
import { RGB } from './rgb';

const MIN_H = 0;
const MAX_H = 360;

/**
 * Normalize the given value as hue.
 *
 * @param value The value to be normalized.
 * @return The normalized hue.
 *
 * @see normalizeS
 * @see normalizeL
 */
export function normalizeH(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_H;
  }

  let normalized = value;
  if (normalized < MIN_H) {
    normalized += MAX_H;
  }
  return normalized % MAX_H;
}

const MIN_S = 0.0;
const MAX_S = 1.0;

/**
 * Normalize the given value as saturation.
 *
 * @param value The value to be normalized.
 * @return The normalized saturation.
 *
 * @see normalizeH
 * @see normalizeL
 */
export function normalizeS(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_S;
  }
  return clamp(value, MIN_S, MAX_S);
}

const MIN_L = 0.0;
const MAX_L = 1.0;

/**
 * Normalize the given value as lightness.
 *
 * @param value The value to be normalized.
 * @return The normalized lightness.
 *
 * @see normalizeH
 * @see normalizeS
 */
export function normalizeL(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_S;
  }
  return clamp(value, MIN_L, MAX_L);
}

/**
 * The type representing a color in HSL.
 */
export type HSLColor = {
  /**
   * The hue value.
   */
  readonly h: number;

  /**
   * The saturation value.
   */
  readonly s: number;

  /**
   * The lightness value.
   */
  readonly l: number;
} & Opacity;

/**
 * The HSL color model implementation.
 */
export const HSL: Model<HSLColor> = {
  pack(color: HSLColor): PackedColor {
    const h = normalizeH(color.h);
    const s = normalizeS(color.s);
    const l = normalizeL(color.l);

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
    return RGB.pack({
      r: Math.round((r + m) * 0xff),
      g: Math.round((g + m) * 0xff),
      b: Math.round((b + m) * 0xff),
      opacity: color.opacity,
    });
  },
  unpack(packed: PackedColor): HSLColor {
    const rgb = RGB.unpack(packed);
    const r = rgb.r / 0xff;
    const g = rgb.g / 0xff;
    const b = rgb.b / 0xff;

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
      h: normalizeH(h),
      s: normalizeS(s),
      l: normalizeL(l),
      opacity: rgb.opacity,
    };
  },
} as const;
