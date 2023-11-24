import { clamp, radianToDegree } from '../math';

/**
 * Class representing a color in the CIELAB color space.
 */
export class Color {
  /**
   * Create a new color instance.
   * @param l The lightness component of the color.
   * @param a The a component of the color.
   * @param b The b component of the color.
   * @throws {TypeError} If the l, a, or b is not finite number.
   */
  constructor(
    private readonly l: number,
    private readonly a: number,
    private readonly b: number,
  ) {
    if (!Number.isFinite(l) || !Number.isFinite(a) || !Number.isFinite(b)) {
      throw new TypeError(`The l, a, and b components must be finite numbers: ${l}, ${a}, ${b}`);
    }
    this.l = clamp(l, 0, 100);
    this.a = clamp(a, -128, 127);
    this.b = clamp(b, -128, 127);
  }

  /**
   * Check if the color is light.
   *
   * @returns True if the color is light, false otherwise.
   * @see isDark
   */
  get isLight() {
    return this.l > 50;
  }

  /**
   * Check if the color is dark.
   *
   * @returns True if the color is dark, false otherwise.
   * @see isLight
   */
  get isDark() {
    return !this.isLight;
  }

  /**
   * Calculate the lightness of the color.
   *
   * @returns The lightness of the color.
   */
  get luminance() {
    return this.l;
  }

  /**
   * Calculate the chroma of the color.
   *
   * @returns The chroma of the color.
   */
  chroma() {
    return Math.sqrt(this.a ** 2 + this.b ** 2);
  }

  /**
   * Calculate the hue of the color.
   *
   * @returns The hue of the color.
   */
  hue() {
    return radianToDegree(Math.atan2(this.b, this.a));
  }
}
