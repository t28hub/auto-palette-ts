import { Color } from '../types';

import { HSLColor } from './hsl';
import { asPackedColor, hsl, rgb } from './space';

export { hsl, lab, rgb, xyz } from './space';

function parseNumber(number: number): Color {
  const packed = asPackedColor(number);
  const decoded = hsl().decode(packed);
  return new HSLColor(decoded.h, decoded.s, decoded.l, decoded.opacity);
}

function parseString(string: string): Color {
  const value = string.replace(/^#/, '');
  if (value.length === 6) {
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    const number = rgb().encode({ r, g, b, opacity: 1.0 });
    return parseNumber(number);
  }

  if (value.length === 8) {
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    const opacity = Number.parseInt(value.slice(6, 8), 16) / 0xff;
    const number = rgb().encode({ r, g, b, opacity });
    return parseNumber(number);
  }
  throw new TypeError(`The given string is not parseable: '${string}'`);
}

/**
 * Parse the given value as a color.
 *
 * @param value The value to be parsed.
 * @return The parsed color.
 * @throws {TypeError} if the value is not supported type.
 */
export function parse(value: unknown): Color {
  if (typeof value === 'number') {
    return parseNumber(value);
  }
  if (typeof value === 'string') {
    return parseString(value);
  }
  if (value instanceof HSLColor) {
    return value.clone();
  }
  throw new TypeError(`Unrecognized type of value: ${value}`);
}
