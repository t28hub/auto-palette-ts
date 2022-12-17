import { PackedColor } from '../../types';

const MIN_PACKED_COLOR = 0x00000000;
const MAX_PACKED_COLOR = 0xffffffff;

/**
 * Convert number as valid {@link PackedColor}.
 *
 * @param value The value to be converted.
 * @return The valid integer color representation.
 * @throws {TypeError} if the value is invalid PackedColor.
 */
export function asPackedColor(value: number): PackedColor {
  if (!Number.isInteger(value) || value < MIN_PACKED_COLOR || value > MAX_PACKED_COLOR) {
    throw new TypeError(`The value(${value}) is not valid PackedColor`);
  }
  return value as PackedColor;
}
