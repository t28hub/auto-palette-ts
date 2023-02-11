import { DeltaEWeightFunction } from './extractor';
import { HierarchicalClustering, Point3 } from './math';
import { DeltaEFunction, Swatch } from './types';

const DEFAULT_SWATCH_COUNT = 6;

/**
 * Color palette class.
 */
export class Palette {
  private readonly swatches: Swatch[];

  private readonly colors: Point3[];

  /**
   * Create a new Palette.
   *
   * @param swatches The list of source swatches.
   * @param deltaEFunction The DeltaE function.
   * @throws {TypeError} if swatches is empty.
   */
  constructor(swatches: Swatch[], private readonly deltaEFunction: DeltaEFunction) {
    if (swatches.length === 0) {
      throw new TypeError('The array of swatches is empty');
    }

    this.swatches = Array.from(swatches).sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    });
    this.colors = this.swatches.map((swatch: Swatch): Point3 => {
      const color = swatch.color.toLab();
      return [color.l, color.a, color.b];
    });
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
    const weightFunction = new DeltaEWeightFunction(this.colors, this.deltaEFunction);
    const clustering = new HierarchicalClustering(count, weightFunction);
    const labels = clustering.label(this.colors);
    const merged = this.swatches.reduce(
      (merged: Map<number, Swatch>, swatch: Swatch, index: number): Map<number, Swatch> => {
        const label = labels[index];
        const previousSwatch = merged.get(label);
        if (!previousSwatch || previousSwatch.population < swatch.population) {
          merged.set(label, swatch);
        }
        return merged;
      },
      new Map<number, Swatch>(),
    );
    return Array.from(merged.values());
  }
}
