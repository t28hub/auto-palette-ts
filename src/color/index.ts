import { radianToDegree } from '../math';

import { assert, assertFiniteNumber } from '../utils';
import { ColorDelta, ColorDeltaMeasure, ciede2000 } from './difference';
import { CIELabSpace, HSLSpace, RGBSpace, XYZSpace } from './space';
import { HSL, LAB, RGB } from './types';

export * from './difference';
export * from './name';
export * from './space';
export * from './types';

/**
 * Color class represents a color in any color space.
 */
export class Color {
  /**
   * Create a new color instance.
   *
   * @private
   * @param l The lightness component of the color.
   * @param a The a component of the color.
   * @param b The b component of the color.
   */
  private constructor(
    private readonly l: number,
    private readonly a: number,
    private readonly b: number,
  ) {
    assertFiniteNumber(l, `The l(${l}) must be a finite number`);
    assertFiniteNumber(a, `The a(${a}) must be a finite number`);
    assertFiniteNumber(b, `The b(${b}) must be a finite number`);
    this.l = CIELabSpace.clampL(l);
    this.a = CIELabSpace.clampA(a);
    this.b = CIELabSpace.clampB(b);
  }

  /**
   * Clone the color.
   *
   * @returns The cloned color.
   */
  clone(): Color {
    return new Color(this.l, this.a, this.b);
  }

  /**
   * Check if the color is light.
   *
   * @returns True if the color is light, false otherwise.
   * @see {@link Color.isDark}
   */
  isLight(): boolean {
    return this.l > 50;
  }

  /**
   * Check if the color is dark.
   *
   * @returns True if the color is dark, false otherwise.
   * @see {@link Color.isLight}
   */
  isDark(): boolean {
    return !this.isLight();
  }

  /**
   * Calculate the lightness of the color.
   *
   * @returns The lightness of the color.
   * @see {@link Color.chroma}
   * @see {@link Color.hue}
   */
  lightness(): number {
    return this.l;
  }

  /**
   * Calculate the chroma of the color.
   *
   * @returns The chroma of the color.
   * @see {@link Color.lightness}
   * @see {@link Color.hue}
   */
  chroma(): number {
    return Math.sqrt(this.a ** 2 + this.b ** 2);
  }

  /**
   * Calculate the hue of the color.
   *
   * @returns The hue of the color.
   * @see {@link Color.lightness}
   * @see {@link Color.chroma}
   */
  hue(): number {
    return radianToDegree(Math.atan2(this.b, this.a));
  }

  /**
   * Compute the color difference between this color and the other color.
   *
   * @param other The other color.
   * @param formula The formula to use to compute the color difference. Default is CIEDE2000.
   * @returns The color difference.
   */
  differenceTo(other: Color, formula: ColorDeltaMeasure<LAB> = ciede2000): ColorDelta {
    return formula({ l: this.l, a: this.a, b: this.b }, { l: other.l, a: other.a, b: other.b });
  }

  /**
   * Return the string representation of the color.
   *
   * @returns The string representation of the color.
   * @see {@link Color.fromString}
   */
  toString(): string {
    const rgb = this.toRGB();
    return RGBSpace.toHexString(rgb);
  }

  /**
   * Convert the color to RGB color space.
   *
   * @returns The color in RGB color space.
   * @see {@link Color.fromRGB}
   */
  toRGB(): RGB {
    const xyz = CIELabSpace.toXYZ({ l: this.l, a: this.a, b: this.b });
    return XYZSpace.toRGB(xyz);
  }

  /**
   * Convert the color to HSL color space.
   *
   * @returns The color in HSL color space.
   * @see {@link Color.fromHSL}
   */
  toHSL(): HSL {
    const rgb = this.toRGB();
    return HSLSpace.fromRGB(rgb);
  }

  /**
   * Convert the color to CIELAB color space.
   *
   * @returns The color in CIELAB color space.
   * @see {@link Color.fromLAB}
   */
  toLAB(): LAB {
    return { l: this.l, a: this.a, b: this.b };
  }

  /**
   * The minimum lightness of the color.
   * @internal
   */
  static MIN_LIGHTNESS = 0;

  /**
   * The maximum lightness of the color.
   * @internal
   */
  static MAX_LIGHTNESS = 100;

  /**
   * The minimum chroma of the color.
   * @internal
   */
  static MIN_CHROMA = 0;

  /**
   * The maximum chroma of the color.
   * @internal
   */
  static MAX_CHROMA = 180;

  /**
   * Create a new Color instance from the given RGB color.
   *
   * @param rgb - The RGB color.
   * @returns The new Color instance.
   * @see {@link Color.toRGB}
   */
  static fromRGB(rgb: RGB): Color {
    const xyz = XYZSpace.fromRGB(rgb);
    const lab = CIELabSpace.fromXYZ(xyz);
    return new Color(lab.l, lab.a, lab.b);
  }

  /**
   * Create a new Color instance from the given HSL color.
   *
   * @param hsl - The HSL color.
   * @returns The new Color instance.
   * @see {@link Color.toHSL}
   */
  static fromHSL(hsl: HSL): Color {
    const rgb = HSLSpace.toRGB(hsl);
    const xyz = XYZSpace.fromRGB(rgb);
    const lab = CIELabSpace.fromXYZ(xyz);
    return new Color(lab.l, lab.a, lab.b);
  }

  /**
   * Create a new Color instance from the given CIELAB color.
   *
   * @param lab - The CIELAB color.
   * @returns The new Color instance.
   * @see {@link Color.toLAB}
   */
  static fromLAB(lab: LAB): Color {
    return new Color(lab.l, lab.a, lab.b);
  }

  /**
   * Create a new Color instance from the given string.
   *
   * @param value - The string to parse.
   * @returns The new Color instance.
   * @see {@link Color.toString}
   */
  static fromString(value: string): Color {
    assert(value.startsWith('#'), `The value(${value}) is not a valid hexadecimal color string`);
    const rgb = RGBSpace.fromHexString(value);
    const xyz = XYZSpace.fromRGB(rgb);
    const lab = CIELabSpace.fromXYZ(xyz);
    return new Color(lab.l, lab.a, lab.b);
  }
}
