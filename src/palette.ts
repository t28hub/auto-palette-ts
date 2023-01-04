import { Swatch } from './types';

/**
 * Color palette class.
 */
export class Palette {
  private readonly swatches: Swatch[];

  /**
   * Create a new Palette.
   *
   * @param swatches The list of swatches.
   * @throws {TypeError} if swatches is empty.
   */
  constructor(swatches: Swatch[]) {
    if (swatches.length === 0) {
      throw new TypeError('The array of swatches is empty');
    }

    this.swatches = [...swatches].sort(
      (swatch1: Swatch, swatch2: Swatch): number => {
        return swatch2.population - swatch1.population;
      },
    );
  }

  /**
   * Return the dominant swatch of this palette.
   *
   * @return The dominant swatch.
   */
  getDominantSwatch(): Swatch {
    return { ...this.swatches[0] };
  }

  /**
   * Return the all swatches of this palette.
   *
   * @return The all swatches.
   */
  getSwatches(): Swatch[] {
    return [...this.swatches];
  }
}
