/**
 * Interface representing ImageData.
 */
export interface ImageData<T extends Uint8ClampedArray | ArrayBuffer> {
  readonly height: number;
  readonly width: number;
  readonly data: T;
}

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

/**
 * Interface representing supported colors.
 */
export interface SupportedColor {
  readonly hsl: HSL;
  readonly lab: Lab;
  readonly rgb: RGB;
  readonly xyz: XYZ;
}

/**
 * String representation of supported color spaces.
 */
export type ColorSpaceName = keyof SupportedColor;

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

declare const validColorDifference: unique symbol;

/**
 * Type representing the color difference.
 */
export type ColorDifference = number & {
  readonly [validColorDifference]: true;
};

/**
 * Interface to compute the color difference.
 */
export interface ColorDifferenceMeasure {
  /**
   * Compute the color difference between 2 colors.
   *
   * @param lab1 The 1st CIE L*a*b* color.
   * @param lab2 The 2nd CIE L*a*b* color.
   * @return The color delta between 2 colors.
   */
  (lab1: Lab, lab2: Lab): ColorDifference;
}

/**
 * Interface representing color.
 */
export interface Color extends AlphaChannel {
  isDark: boolean;

  isLight: boolean;

  clone(): Color;

  pack(): PackedColor;

  mix(other: Color, fraction: number): Color;

  convertTo<T extends ColorSpaceName>(name: T): SupportedColor[T];

  difference(other: Color, measure: ColorDifferenceMeasure): ColorDifference;
}

/**
 * Type representing the swatch of palette.
 */
export type Swatch<T extends Color | PackedColor> = {
  readonly color: T;
  readonly population: number;
};
