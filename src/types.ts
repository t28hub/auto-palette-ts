/**
 * Function interface to be called on resolved.
 *
 * @see Promise
 * @see RejectionFunction
 */
export interface ResolutionFunction<T> {
  (value: T | PromiseLike<T>): void;
}

/**
 * Function interface to be called on rejected.
 *
 * @see Promise
 * @see ResolutionFunction
 */
export interface RejectionFunction {
  (reason?: any): void;
}

/**
 * Type representing supported image source.
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData;

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
  compute(lab1: Lab, lab2: Lab): ColorDifference;
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

  difference(other: Color): ColorDifference;

  difference(other: Color, measure: ColorDifferenceMeasure): ColorDifference;
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

/**
 * Supported color extraction quality.
 */
export type Quality = 'low' | 'middle' | 'high';
