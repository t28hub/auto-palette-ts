import { Color } from '../types';

import { HSLColor } from './hsl';
import { asPackedColor, hsl } from './space';

export { hsl, lab, rgb, xyz } from './space';

function parseNumber(value: number): Color {
  const packed = asPackedColor(value);
  const decoded = hsl().decode(packed);
  return new HSLColor(decoded.h, decoded.s, decoded.l, decoded.opacity);
}

function parseString(value: string): Color {
  const string = value.substring(1);
  const number = Number.parseInt(string, 16);
  return parseNumber(number);
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
  throw new TypeError(`Unrecognized type of value(${value})`);
}
