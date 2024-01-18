/**
 * HSL type represents a color in HSL color space.
 */
export type HSL = {
  /**
   * The hue value in degrees [0, 360).
   */
  readonly h: number;

  /**
   * The saturation value in [0.0, 1.0].
   */
  readonly s: number;

  /**
   * The lightness value in [0.0, 1.0].
   */
  readonly l: number;
};

/**
 * LAB type represents a color in CIELab color space.
 */
export type LAB = {
  /**
   * The lightness value in [0, 100].
   */
  readonly l: number;

  /**
   * The a value in [-128, 128].
   */
  readonly a: number;

  /**
   * The b value in [-128, 128].
   */
  readonly b: number;
};

/**
 * RGB type represents a color in RGB color space.
 */
export type RGB = {
  /**
   * The red value in [0, 255].
   */
  readonly r: number;

  /**
   * The green value in [0, 255].
   */
  readonly g: number;

  /**
   * The blue value in [0, 255].
   */
  readonly b: number;
};

/**
 * XYZ type represents a color in XYZ color space.
 */
export type XYZ = {
  /**
   * The x value in [0.0, 0.950456].
   */
  readonly x: number;

  /**
   * The y value in [0.0, 1.0].
   */
  readonly y: number;

  /**
   * The z value in [0.0, 1.088644].
   */
  readonly z: number;
};

/**
 * Color type represents a color in any color space.
 */
export type ColorType = RGB | HSL | LAB | XYZ;

/**
 * AlphaChannel type represents a color with alpha channel.
 */
type AlphaChannel<T> = T & {
  /**
   * The alpha value in [0, 255].
   */
  readonly a: number;
};

/**
 * RGBA type represents a color in RGBA color space.
 */
export type RGBA = AlphaChannel<RGB>;
