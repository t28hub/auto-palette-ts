import { ciede2000, DifferenceFunction, LAB } from './color';
import { ColorFilterFunction, dbscanExtractor } from './extractor';
import { createImageData, ImageSource } from './image';
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
   * @param limit The maximum number of swatches to find.
   * @return The best swatches within the given limit.
   * @throws {TypeError} If the limit is less than or equal to 0.
   */
  findSwatch(limit: number = DEFAULT_SWATCH_COUNT): Swatch[] {
    if (limit <= 0) {
      throw new TypeError(`The limit must be greater than 0: ${limit}`);
    }

    // If the limit exceeds the number of swatches, return all swatches.
    if (limit >= this.swatches.length) {
      return Array.from(this.swatches);
    }

    // Select best swatches using the Farthest Point Sampling algorithm.
    const selected = new Map<number, Swatch>();
    const distances = new Array<number>(this.swatches.length).fill(Number.POSITIVE_INFINITY);

    const initialIndex = 0;
    selected.set(initialIndex, this.swatches[initialIndex]);
    distances[initialIndex] = 0.0;
    this.swatches.forEach((swatch, index) => {
      distances[index] = swatch.color.differenceTo(this.swatches[initialIndex].color, this.differenceFormula);
    });

    while (selected.size < limit) {
      // Find the farthest swatch from the selected swatches.
      let maxDistance = 0.0;
      let farthestIndex = -1;
      for (let i = 0; i < this.swatches.length; i++) {
        if (selected.has(i)) {
          continue;
        }

        const distance = distances[i];
        if (distance > maxDistance) {
          maxDistance = distance;
          farthestIndex = i;
        }
      }

      // If no swatch can be selected, stop the algorithm.
      if (farthestIndex < 0) {
        break;
      }

      selected.set(farthestIndex, this.swatches[farthestIndex]);
      distances[farthestIndex] = 0.0;

      // Update minimum distance to the selected swatches.
      for (let i = 0; i < this.swatches.length; i++) {
        if (selected.has(i)) {
          continue;
        }

        const previousDistance = distances[i];
        const currentDistance = this.swatches[farthestIndex].color.differenceTo(
          this.swatches[i].color,
          this.differenceFormula,
        );
        distances[i] = Math.min(previousDistance, currentDistance);
      }
    }
    return Array.from(selected.values());
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
