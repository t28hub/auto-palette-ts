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

export function color(value: unknown): Color {
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
