import { Color } from '../color';
import { ExtractionResult } from '../extractor';

/**
 * Color palette class.
 */
export class Palette {
  private readonly results: ExtractionResult<Color>[];

  /**
   * Create a new Palette from colors.
   *
   * @param results The extracted results.
   * @throws {TypeError} if colors is empty.
   */
  constructor(results: ExtractionResult<Color>[]) {
    if (results.length === 0) {
      throw new TypeError('The array of results is empty');
    }

    this.results = [...results].sort((color1: ExtractionResult<Color>, color2: ExtractionResult<Color>): number => {
      return color2.population - color1.population;
    });
  }

  /**
   * Return the dominant color of this palette.
   *
   * @return The dominant color.
   */
  getDominantColor(): Color {
    return this.results[0].color;
  }

  /**
   * Return the all colors.
   *
   * @return The colors.
   */
  getColors(): Color[] {
    return this.results.map((featureColor: ExtractionResult<Color>): Color => featureColor.color);
  }
}
