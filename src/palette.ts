import { SwatchCollection } from './collection';
import { ColorFilterFunction, dbscanExtractor } from './extractor';
import { createImageData, ImageSource } from './image';
import { euclidean, FarthestPointSampling, Point3 } from './math';
import { Swatch } from './swatch';

const DEFAULT_SWATCH_COUNT = 6;

/**
 * Palette class represents a color palette.
 */
export class Palette {
  private readonly collection: SwatchCollection;

  /**
   * Create a new Palette instance.
   *
   * @param swatches - The swatches of the palette.
   */
  constructor(swatches: Swatch[]) {
    const sampling = new FarthestPointSampling<Point3>(euclidean);
    this.collection = new SwatchCollection(swatches, sampling);
  }

  /**
   * Return the number of swatches.
   *
   * @return The number of swatches.
   */
  size(): number {
    return this.collection.size();
  }

  /**
   * Check whether the palette is empty.
   *
   * @return True if the palette is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.collection.isEmpty();
  }

  /**
   * Return the dominant swatch of the palette.
   *
   * @return The dominant swatch.
   */
  getDominantSwatch(): Swatch {
    return this.collection.at(0);
  }

  /**
   * Find the best swatches from the palette.
   *
   * @param limit The number of swatches to find.
   * @return The best swatches. If the palette is empty, an empty array is returned.
   * @throws {TypeError} If the limit is less than or equal to 0.
   */
  findSwatches(limit: number = DEFAULT_SWATCH_COUNT): Swatch[] {
    if (limit <= 0) {
      throw new TypeError(`The number of swatches to find must be greater than 0: ${limit}`);
    }
    const n = Math.min(limit, this.collection.size());
    return this.collection.find(n);
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
    return new Palette(swatches);
  }
}
