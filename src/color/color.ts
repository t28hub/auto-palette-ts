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
   * Return string representation.
   *
   * @return The string representation.
   */
  toString(): string {
    const string = this.toPackedColor().toString(16).padStart(8, '0');
    return `Color(0x${string})`;
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
