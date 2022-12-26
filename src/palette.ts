import { Color, Swatch } from './types';

/**
 * Color palette class.
 */
export class Palette {
  private readonly swatches: Swatch<Color>[];

  /**
   * Create a new Palette from colors.
   *
   * @param swatches The list of swatches.
   * @throws {TypeError} if colors is empty.
   */
  constructor(swatches: Swatch<Color>[]) {
    if (swatches.length === 0) {
      throw new TypeError('The array of results is empty');
    }

    this.swatches = [...swatches].sort((swatch1: Swatch<Color>, swatch2: Swatch<Color>): number => {
      return swatch2.population - swatch1.population;
    });
  }

  /**
   * Return the dominant color of this palette.
   *
   * @return The dominant color.
   */
  getDominantColor(): Color {
    return this.swatches[0].color;
  }

  /**
   * Return the all colors.
   *
   * @return The colors.
   */
  getColors(): Color[] {
    return this.swatches.map((featureColor: Swatch<Color>): Color => featureColor.color);
  }
}
