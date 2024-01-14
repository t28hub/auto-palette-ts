import { clamp } from '../../math';
import { HSL, RGB } from '../types';

import { assertFiniteNumber, assertInteger } from '../../utils';
import { MAX_RGB, clampValue } from './rgb';

/**
 * The minimum value of the 'hue' component.
 *
 * @see {@link MAX_HUE}
 * @see {@link normalizeHue}
 */
export const MIN_HUE = 0.0;

/**
 * The maximum value of the 'hue' component.
 *
 * @see {@link MIN_HUE}
 * @see {@link normalizeHue}
 */
export const MAX_HUE = 360.0;

/**
 * The minimum value of the 'saturation' component.
 *
 * @see {@link MAX_SATURATION}
 * @see {@link clampSaturation}
 */
export const MIN_SATURATION = 0.0;

/**
 * The maximum value of the 'saturation' component.
 *
 * @see {@link MIN_SATURATION}
 * @see {@link clampSaturation}
 */
export const MAX_SATURATION = 1.0;

/**
 * The minimum value of the 'lightness' component.
 *
 * @see {@link MAX_LIGHTNESS}
 * @see {@link clampLightness}
 */
export const MIN_LIGHTNESS = 0.0;

/**
 * The maximum value of the 'lightness' component.
 *
 * @see {@link MIN_LIGHTNESS}
 * @see {@link clampLightness}
 */
export const MAX_LIGHTNESS = 1.0;

/**
 * Normalize the hue component of the color.
 * The hue component is normalized to the range [0, 360).
 *
 * @param value The hue component of the color.
 * @returns The normalized hue component.
 * @see {@link clampSaturation}
 * @see {@link clampLightness}
 */
export function normalizeHue(value: number): number {
  return ((value % MAX_HUE) + MAX_HUE) % MAX_HUE;
}

/**
 * Clamp the saturation component of the color.
 * The saturation component is clamped to the range [0, 1].
 *
 * @param value The saturation component of the color.
 * @returns The clamped saturation component.
 * @see {@link normalizeHue}
 * @see {@link clampLightness}
 */
export function clampSaturation(value: number): number {
  return clamp(value, MIN_SATURATION, MAX_SATURATION);
}

/**
 * Clamp the lightness component of the color.
 * The lightness component is clamped to the range [0, 1].
 *
 * @param value The lightness component of the color.
 * @returns The clamped lightness component.
 * @see {@link normalizeHue}
 * @see {@link clampSaturation}
 */
export function clampLightness(value: number): number {
  return clamp(value, MIN_LIGHTNESS, MAX_LIGHTNESS);
}

/**
 * Convert a color from the HSL color space to the RGB color space.
 *
 * @param rgb - The color in the RGB color space.
 * @returns The converted color in the RGB color space.
 * @throws {TypeError} If the r, g, or b is not finite number.
 * @see {@link toRGB}
 */
export function fromRGB(rgb: RGB): HSL {
  assertInteger(rgb.r, `The r(${rgb.r}) must be an integer`);
  assertInteger(rgb.g, `The g(${rgb.g}) must be an integer`);
  assertInteger(rgb.b, `The b(${rgb.b}) must be an integer`);

  // Normalize the RGB values.
  const r = clampValue(rgb.r) / MAX_RGB;
  const g = clampValue(rgb.g) / MAX_RGB;
  const b = clampValue(rgb.b) / MAX_RGB;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue: number;
  if (delta === 0) {
    hue = 0;
  } else if (max === r) {
    hue = 60 * (((g - b) / delta) % 6);
  } else if (max === g) {
    hue = 60 * ((b - r) / delta + 2);
  } else {
    hue = 60 * ((r - g) / delta + 4);
  }

  const lightness = (max + min) / 2.0;

  let saturation = 0.0;
  if (delta !== 0) {
    saturation = delta / (1.0 - Math.abs(2.0 * lightness - 1.0));
  }

  return {
    h: normalizeHue(hue),
    s: clampSaturation(saturation),
    l: clampLightness(lightness),
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
export function toRGB({ h, s, l }: HSL): RGB {
  assertFiniteNumber(h, `The h(${h}) must be a finite number`);
  assertFiniteNumber(s, `The s(${s}) must be a finite number`);
  assertFiniteNumber(l, `The l(${l}) must be a finite number`);

  const hue = normalizeHue(h);
  const saturation = clampSaturation(s);
  const lightness = clampLightness(l);

  const c = (1.0 - Math.abs(2.0 * lightness - 1.0)) * saturation;
  const x = (1.0 - Math.abs(((hue / 60) % 2) - 1.0)) * c;
  const m = lightness - c / 2.0;

  let [r, g, b] = [0.0, 0.0, 0.0];
  if (0 <= hue && hue < 60) {
    r = c;
    g = x;
  } else if (60 <= hue && hue < 120) {
    r = x;
    g = c;
  } else if (120 <= hue && hue < 180) {
    g = c;
    b = x;
  } else if (180 <= hue && hue < 240) {
    g = x;
    b = c;
  } else if (240 <= hue && hue < 300) {
    r = x;
    b = c;
  } else if (300 <= hue && hue < 360) {
    r = c;
    b = x;
  }

  return {
    r: clampValue((r + m) * MAX_RGB),
    g: clampValue((g + m) * MAX_RGB),
    b: clampValue((b + m) * MAX_RGB),
  };
}
