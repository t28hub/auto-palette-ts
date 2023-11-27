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
   * Find the best swatches from this palette.
   *
   * @param limit The max number of swatches.
   * @return The best swatches within the given limit.
   * @throws TypeError If the limit is less than or equal to 0.
   */
  findSwatch(limit: number = DEFAULT_SWATCH_COUNT): Swatch[] {
    if (limit <= 0) {
      throw new TypeError(`The limit must be greater than 0: ${limit}`);
    }

    if (limit >= this.swatches.length) {
      return Array.from(this.swatches);
    }

    // Select best swatches using the Furthest Point Sampling algorithm.
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
