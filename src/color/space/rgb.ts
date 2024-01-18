import { clamp } from '../../math';
import { assert, assertInteger } from '../../utils';
import { RGB } from '../types';

/**
 * The minimum value of the RGB component.
 *
 * @see {@link MAX_RGB}
 * @see {@link clampValue}
 */
const MIN_RGB = 0x00;

/**
 * The maximum value of the RGB component.
 *
 * @see {@link MIN_RGB}
 * @see {@link clampValue}
 */
export const MAX_RGB = 0xff;

/**
 * Clamp the RGB component of the color.
 *
 * @param value The RGB component of the color.
 * @returns The clamped RGB component.
 */
export function clampValue(value: number): number {
  return clamp(value, MIN_RGB, MAX_RGB);
}
/**
 * Convert a color from the hexadecimal string to the RGB color space.
 *
 * @param value - The color in hexadecimal string.
 * @returns The color in RGB color space.
 */
export function fromHexString(value: string): RGB {
  assert(value.startsWith('#'), `The value(${value}) is not a valid hexadecimal color string`);

  let r = NaN;
  let g = NaN;
  let b = NaN;

  if (value.length === 4) {
    // #rgb
    r = Number.parseInt(value[1], 16) * 0x11;
    g = Number.parseInt(value[2], 16) * 0x11;
    b = Number.parseInt(value[3], 16) * 0x11;
  } else if (value.length === 7) {
    // #rrggbb
    r = Number.parseInt(value.slice(1, 3), 16);
    g = Number.parseInt(value.slice(3, 5), 16);
    b = Number.parseInt(value.slice(5, 7), 16);
  }

  assertInteger(r, `The value(${value}) is not a valid hexadecimal color string`);
  assertInteger(g, `The value(${value}) is not a valid hexadecimal color string`);
  assertInteger(b, `The value(${value}) is not a valid hexadecimal color string`);
  return { r, g, b };
}

/**
 * Convert a color from the RGB color space to the hexadecimal string.
 *
 * @param r The red component of the color.
 * @param g The green component of the color.
 * @param b The blue component of the color.
 * @returns The hexadecimal string.
 */
export function toHexString({ r, g, b }: RGB): string {
  return [r, g, b].reduce((string, value) => {
    assert(Number.isFinite(value), `The r, g, and b components must be finite numbers: ${r}, ${g}, ${b}`);
    const hex = clampValue(value).toString(16).padStart(2, '0').toUpperCase();
    return string + hex;
  }, '#');
}
