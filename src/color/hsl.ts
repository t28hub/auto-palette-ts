import { Color, ColorDifference, PackedColor, ColorDifferenceMeasure, HSL, Lab, RGB } from '../types';

import { ciede2000 } from './deltae';
import { clampH, clampL, clampS, hsl, lab, rgb } from './space';

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

  /**
   * Convert this color in HSL color space.
   *
   * @return The converted color in HSL.
   */
  toHSL(): HSL {
    return {
      h: this.h,
      s: this.s,
      l: this.l,
      opacity: this.opacity,
    };
  }

  /**
   * Convert this color in CIE L*a*b* color space.
   *
   * @return The converted color in CIE L*a*b*.
   */
  toLab(): Lab {
    return lab().decode(this.pack());
  }

  /**
   * Convert this color in RGB color space.
   *
   * @return The converted color in RGB.
   */
  toRGB(): RGB {
    return rgb().decode(this.pack());
  }

  /**
   * Clone this color instance.
   *
   * @return The cloned color.
   */
  clone(): Color {
    return new HSLColor(this.h, this.s, this.l, this.opacity);
  }

  /**
   * Pack this color.
   *
   * @return The packed color.
   */
  pack(): PackedColor {
    return hsl().encode({
      h: this.h,
      s: this.s,
      l: this.l,
      opacity: this.opacity,
    });
  }

  /**
   * Mix with the given color.
   *
   * @param other The other color.
   * @param fraction The fraction.
   * @return The mixed color.
   */
  mix(other: Color, fraction = 0.5): Color {
    const hsl1 = this.toHSL();
    const hsl2 = other.toHSL();

    // Find shortest path along the hue circle.
    const [hue1, hue2] = [
      [hsl1.h, hsl2.h],
      [hsl1.h, hsl2.h + 360],
      [hsl1.h + 360, hsl2.h],
    ].sort((path1, path2): number => {
      const delta1 = Math.abs(path1[0] - path1[1]);
      const delta2 = Math.abs(path2[0] - path2[1]);
      return delta1 - delta2;
    })[0];

    const h = hue1 + fraction * (hue2 - hue1);
    const s = hsl1.s + fraction * (hsl2.s - hsl1.s);
    const l = hsl1.l + fraction * (hsl2.l - hsl1.l);
    const opacity = hsl1.opacity + fraction * (hsl2.opacity - hsl1.opacity);
    return new HSLColor(h, s, l, opacity);
  }

  /**
   * Compute the color difference with the given color.
   *
   * @param other The other color.
   * @param measure The color difference formula.
   * @return The color difference.
   */
  difference(other: Color, measure: ColorDifferenceMeasure = ciede2000): ColorDifference {
    return measure(this.toLab(), other.toLab());
  }
}
