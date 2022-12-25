import { PackedColor } from '../../types';

const MIN_PACKED_COLOR = 0x00000000;
const MAX_PACKED_COLOR = 0xffffffff;

/**
 * Check whether the given value is valid {@link PackedColor}.
 *
 * @param value The value to be checked.
 * @return true if the value is valid {@link PackedColor}.
 */
export function isPackedColor(value: unknown): value is PackedColor {
  if (typeof value !== 'number') {
    return false;
  }
  if (!Number.isInteger(value)) {
    return false;
  }
  return MIN_PACKED_COLOR <= value && value <= MAX_PACKED_COLOR;
}

/**
 * Convert number as valid {@link PackedColor}.
 *
 * @param value The value to be converted.
 * @return The valid integer color representation.
 * @throws {TypeError} if the value is invalid PackedColor.
 */
export function asPackedColor(value: number): PackedColor {
  if (!isPackedColor(value)) {
    throw new TypeError(`The value(${value}) is not valid PackedColor`);
  }
  return value;
}
