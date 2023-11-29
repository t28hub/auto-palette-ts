import { ciede2000, DifferenceFunction, LAB } from './color';
import { ColorFilterFunction, dbscanExtractor } from './extractor';
import { createImageData, ImageSource } from './image';
import { FarthestPointSampling } from './math';
import { Swatch } from './swatch';

const DEFAULT_SWATCH_COUNT = 6;

/**
 * Palette class represents a color palette.
 */
export class Palette {
  private readonly swatches: Swatch[];

  /**
   * Create a new Palette instance.
   *
   * @param swatches - The swatches of the palette.
   * @param differenceFormula - The function to calculate the color difference between two colors.
   */
  constructor(
    swatches: Swatch[],
    private readonly differenceFormula: DifferenceFunction<LAB>,
  ) {
    // Sort the swatches by population in descending order.
    this.swatches = Array.from(swatches).sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    });
  }

  /**
   * Return the number of swatches.
   *
   * @return The number of swatches.
   */
  size(): number {
    return this.swatches.length;
  }

  /**
   * Check whether the palette is empty.
   *
   * @return True if the palette is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.swatches.length === 0;
  }

  /**
   * Return the dominant swatch of the palette.
   *
   * @return The dominant swatch.
   */
  getDominantSwatch(): Swatch {
    return { ...this.swatches[0] };
  }

  /**
   * Find the best swatches from the palette.
   *
   * @param n - The number of swatches to find.
   * @return The best swatches. If the palette is empty, an empty array is returned.
   * @throws {TypeError} If the limit is less than or equal to 0.
   */
  findSwatches(n: number = DEFAULT_SWATCH_COUNT): Swatch[] {
    if (n <= 0) {
      throw new TypeError(`The number of swatches to find must be greater than 0: ${n}`);
    }

    const sampling = new FarthestPointSampling<Swatch>((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch1.color.differenceTo(swatch2.color, this.differenceFormula);
    });
    return sampling.sample(this.swatches, n);
  }

  /**
   * Extract a color palette from the given image source.
   *
   * @param source The source of the image.
   * @param filters The color filter functions.
   * @return A new Palette instance containing the extracted swatches.
   */
  static extract(source: ImageSource, filters: ColorFilterFunction[] = []): Palette {
    const imageData = createImageData(source);
    const extractor = dbscanExtractor({
      // Copy the filters array to prevent mutation.
      filters: [...filters],
    });
    const swatches = extractor.extract(imageData);
    return new Palette(swatches, ciede2000);
  }
}
