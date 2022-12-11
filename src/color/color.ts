import { colorModel, ColorModel, HSL, HSLColor, clampH, clampL, clampS, PackedColor, SupportedColor } from './model';

/**
 * Class representing a color in HSL model.
 */
export class Color implements HSLColor {
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
    const hex = this.toPackedColor().toString(16).padStart(8, '0');
    return `#${hex}`;
  }

  /**
   * Return packed color.
   *
   * @return The packed color.
   */
  toPackedColor(): PackedColor {
    return HSL.pack({
      h: this.h,
      s: this.s,
      l: this.l,
      opacity: this.opacity,
    });
  }

  delta(other: Color): number {
    const lab1 = this.convertTo('lab');
    const lab2 = other.convertTo('lab');
    const deltaL = lab1.l - lab2.l;
    const deltaA = lab1.a - lab2.a;
    const deltaB = lab1.b - lab2.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }

  /**
   * Convert this color by the name of color model.
   *
   * @param name The name of color model.
   * @return The converted color.
   */
  convertTo<T extends ColorModel>(name: T): SupportedColor[T] {
    const model = colorModel(name);
    return model.unpack(this.toPackedColor());
  }

  /**
   * Create a new Color from the packed color.
   *
   * @param packed The packed color.
   * @return The color.
   */
  static fromPackedColor(packed: PackedColor): Color {
    const hsl = HSL.unpack(packed);
    return new Color(hsl.h, hsl.s, hsl.l, hsl.opacity);
  }
}
