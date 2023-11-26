import { ciede2000, DifferenceFunction, LAB } from './color';
import { alphaFilter, dbscanExtractor, luminanceFilter } from './extractor';
import { createImageData, ImageSource } from './image';
import { Distance, HierarchicalClustering, toDistance } from './math';
import { Swatch } from './swatch';

const DEFAULT_SWATCH_COUNT = 6;

/**
 * Color palette class.
 */
export class Palette {
  private readonly swatches: Swatch[];

  /**
   * Create a new Palette instance.
   *
   * @param swatches - The swatches of the palette.
   * @param differenceFormula - The color difference formula.
   */
  constructor(
    swatches: Swatch[],
    private readonly differenceFormula: DifferenceFunction<LAB>,
  ) {
    this.swatches = Array.from(swatches).sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    });
  }

  /**
   * Return the size of swatches.
   *
   * @return The size of swatches.
   */
  size(): number {
    return this.swatches.length;
  }

  /**
   * Checks if the palette is empty.
   *
   * @return True if the palette is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.swatches.length === 0;
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
   * Return the given number of swatches.
   *
   * @param count The max number of swatches.
   * @return The swatches within the given count.
   */
  getSwatches(count: number = DEFAULT_SWATCH_COUNT): Swatch[] {
    const algorithm = new HierarchicalClustering((swatch1: Swatch, swatch2: Swatch): Distance => {
      const difference = swatch1.color.differenceTo(swatch2.color, this.differenceFormula);
      return toDistance(difference);
    });
    const dendrogram = algorithm.fit(this.swatches);
    const labels = dendrogram.partition(Math.min(count, dendrogram.length));
    const merged = labels.reduce((merged, label, index): Map<number, Swatch> => {
      const swatch = this.swatches[index];
      const previous = merged.get(label);
      if (!previous) {
        merged.set(label, swatch);
        return merged;
      }

      const population = previous.population + swatch.population;
      const fraction = swatch.population / population;
      if (fraction <= 0.5) {
        merged.set(label, { color: swatch.color.clone(), population, position: swatch.position });
      } else {
        merged.set(label, { color: previous.color.clone(), population, position: previous.position });
      }
      return merged;
    }, new Map<number, Swatch>());
    return Array.from(merged.values());
  }

  /**
   * Extract a color palette from the given image source.
   *
   * @param source The source of the image.
   * @return A new Palette instance containing the extracted swatches.
   */
  static extract(source: ImageSource): Palette {
    const imageData = createImageData(source);
    const extractor = dbscanExtractor({
      colorFilters: [alphaFilter(), luminanceFilter()],
    });
    const swatches = extractor.extract(imageData);
    return new Palette(swatches, ciede2000);
  }
}
