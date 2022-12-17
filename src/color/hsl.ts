import { Color, DeltaE, PackedColor, SupportedColor, ColorSpaceName } from '../types';

import { HSLColorSpace, clampH, clampL, clampS, colorSpace } from './space';

/**
 * Class representing a color in HSL color space.
 */
export class HSLColor implements Color {
  /**
   * The hue value.
   */
  readonly h: number;

  /**
   * The saturation value.
   */
  readonly s: number;

  /**
   * The lightness value.
   */
  readonly l: number;

  /**
   * Create a new color.
   *
   * @param h The hue value.
   * @param s The saturation value.
   * @param l The lightness value.
   * @param opacity The opacity value.
   */
  constructor(h: number, s: number, l: number, readonly opacity: number) {
    this.h = clampH(h);
    this.s = clampS(s);
    this.l = clampL(l);
  }

  /**
   * Return whether this color is light.
   *
   * @return true if this color is light.
   */
  get isLight(): boolean {
    return this.l > 0.5;
  }

  /**
   * Return whether this color is dark.
   *
   * @return true if this color is dark.
   */
  get isDark(): boolean {
    return !this.isLight;
  }

  /**
   * Return hex string representation.
   *
   * @return The hex string representation.
   */
  toString(): string {
    const hex = this.pack().toString(16).padStart(8, '0');
    return `#${hex}`;
  }

  clone(): Color {
    return new HSLColor(this.h, this.s, this.l, this.opacity);
  }

  /**
   * Pack this color.
   *
   * @return The packed color.
   */
  pack(): PackedColor {
    return HSLColorSpace.encode({
      h: this.h,
      s: this.s,
      l: this.l,
      opacity: this.opacity,
    });
  }

  convertTo<T extends ColorSpaceName>(name: T): SupportedColor[T] {
    return colorSpace(name).decode(this.pack());
  }

  differenceTo(other: Color): DeltaE {
    const lab1 = this.convertTo('lab');
    const lab2 = other.convertTo('lab');
    const deltaL = lab1.l - lab2.l;
    const deltaA = lab1.a - lab2.a;
    const deltaB = lab1.b - lab2.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB) as DeltaE;
  }
}
