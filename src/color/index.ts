import { Color } from '../types';

import { HSLColor } from './hsl';
import { asPackedColor, HSLColorSpace } from './space';

export { colorSpace } from './space';

function parseNumber(value: number): Color {
  const packed = asPackedColor(value);
  const hsl = HSLColorSpace.decode(packed);
  return new HSLColor(hsl.h, hsl.s, hsl.l, hsl.opacity);
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
  throw new TypeError(`Unrecognized type of value(${value})`);
}
