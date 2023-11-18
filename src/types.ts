/**
 * Type representing alpha channel.
 */
export type AlphaChannel = {
  readonly opacity: number;
};

/**
 * Type representing an HSL color.
 */
export type HSL = {
  readonly h: number;
  readonly s: number;
  readonly l: number;
} & AlphaChannel;

/**
 * Type representing a CIE L*a*b* color.
 */
export type Lab = {
  readonly l: number;
  readonly a: number;
  readonly b: number;
} & AlphaChannel;

/**
 * Type representing a RGB color.
 */
export type RGB = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
} & AlphaChannel;

/**
 * Type representing a CIE XYZ color.
 */
export type XYZ = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
} & AlphaChannel;

declare const validPackedColor: unique symbol;

/**
 * Type representing packed color.
 */
export type PackedColor = number & {
  readonly [validPackedColor]: true;
};

/**
 * Interface representing color space.
 */
export interface ColorSpace<T extends AlphaChannel> {
  /**
   * Decode the packed color.
   *
   * @param packed The packed color.
   * @return The decoded color.
   */
  decode(packed: PackedColor): T;

  /**
   * Encode the given color.
   *
   * @param color The color to be packed.
   * @return The encoded color.
   */
  encode(color: T): PackedColor;
}

declare const validDeltaE: unique symbol;

/**
 * Type representing the color difference.
 */
export type DeltaE = number & {
  readonly [validDeltaE]: true;
};

/**
 * Function interface to compute the DeltaE.
 */
export interface DeltaEFunction {
  /**
   * Compute the DeltaE between 2 colors.
   *
   * @param lab1 The 1st CIE L*a*b* color.
   * @param lab2 The 2nd CIE L*a*b* color.
   * @return The DeltaE between 2 colors.
   */
  compute(lab1: Lab, lab2: Lab): DeltaE;
}

/**
 * Interface representing color.
 */
export interface Color extends AlphaChannel {
  isDark: boolean;

  isLight: boolean;

  toString(): string;

  toHSL(): HSL;

  toLab(): Lab;

  toRGB(): RGB;

  clone(): Color;

  pack(): PackedColor;

  mix(other: Color, fraction: number): Color;

  difference(other: Color): DeltaE;

  difference(other: Color, measure: DeltaEFunction): DeltaE;
}

/**
 * Interface representing the position of the swatch.
 */
export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

/**
 * Interface representing the swatch of palette.
 */
export interface Swatch {
  readonly color: Color;
  readonly population: number;
  readonly coordinate: Coordinate;
}
