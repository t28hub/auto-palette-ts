declare const validPackedColor: unique symbol;

/**
 * Packed color representation.
 */
export type PackedColor = number & {
  readonly [validPackedColor]: true;
};

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

/**
 * The opacity representation.
 */
export type Opacity = {
  /**
   * The opacity value.
   */
  readonly opacity: number;
};

/**
 * The interface representing color model.
 */
export interface Model<T extends Opacity> {
  /**
   * Unpack the packed color.
   *
   * @param packed The packed color.
   * @return The color.
   */
  unpack(packed: PackedColor): T;

  /**
   * Pack the given color.
   *
   * @param color The color to be packed.
   * @return The packed color.
   */
  pack(color: T): PackedColor;
}
