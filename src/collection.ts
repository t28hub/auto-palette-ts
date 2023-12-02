import { euclidean, LinearSearch, Point3, RandomSampling, SamplingStrategy } from './math';
import { Swatch } from './swatch';

/**
 * SwatchCollection class represents a collection of swatches.
 */
export class SwatchCollection {
  private readonly swatches: Swatch[];
  private readonly colors: Point3[];

  /**
   * Create a new SwatchCollection instance.
   *
   * @param swatches - The array of swatches.
   * @param samplingStrategy - The sampling strategy to use. Default is RandomSampling.
   */
  constructor(
    swatches: Swatch[],
    private readonly samplingStrategy: SamplingStrategy<Point3> = new RandomSampling(),
  ) {
    // Sort the swatches by population in descending order.
    this.swatches = Array.from(swatches).sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    });
    this.colors = this.swatches.map((swatch: Swatch): Point3 => {
      const { l, a, b } = swatch.color.toLAB();
      return [l, a, b];
    });
  }

  /**
   * Return the number of swatches.
   *
   * @returns The number of swatches.
   */
  size(): number {
    return this.swatches.length;
  }

  /**
   * Check if the collection is empty.
   *
   * @returns True if the collection is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.swatches.length === 0;
  }

  /**
   * Get the swatch at the specified index.
   *
   * @param index - The index of the swatch.
   * @returns The swatch at the specified index.
   * @throws {TypeError} If the index is not an integer.
   * @throws {RangeError} If the index is out of range.
   */
  at(index: number): Swatch {
    if (!Number.isInteger(index)) {
      throw new TypeError(`The index must be an integer: ${index}`);
    }
    if (index < 0 || index >= this.swatches.length) {
      throw new RangeError(`The index must be in the range [0, ${this.swatches.length}): ${index}`);
    }
    return { ...this.swatches[index] };
  }

  /**
   * Find the best swatches in the collection.
   *
   * @param n The number of swatches to find.
   * @returns The array of the best swatches.
   * @throws {TypeError} If the n is not an integer.
   * @throws {RangeError} If the n is out of range [1, size].
   */
  find(n: number): Swatch[] {
    if (!Number.isInteger(n)) {
      throw new TypeError(`The number of swatches to find must be an integer: ${n}`);
    }
    if (n <= 0 || n > this.colors.length) {
      throw new RangeError(`The number of swatches to find must be in the range [1, ${this.colors.length}]: ${n}`);
    }

    const sampled = this.samplingStrategy.sample(this.colors, n);

    // Find the best swatches from the all swatches.
    const bestSwatches = new Array<Swatch>(sampled.length);
    const neighborSearch = new LinearSearch(sampled, euclidean);
    for (let i = 0; i < this.swatches.length; i++) {
      const color = this.colors[i];
      const nearest = neighborSearch.searchNearest(color);
      // If the nearest color is too far away, skip this swatch.
      if (nearest.distance > 20.0) {
        continue;
      }

      const swatch = this.swatches[i];
      const bestSwatch = bestSwatches[nearest.index];

      // If there is no best swatch, set the swatch as the best swatch.
      if (!bestSwatch) {
        bestSwatches[nearest.index] = { ...swatch };
        continue;
      }

      // If the swatch is better than the best swatch, set the swatch as the best swatch.
      const score = swatch.population * swatch.color.chroma();
      const bestScore = bestSwatch.population * bestSwatch.color.chroma();
      if (score > bestScore) {
        bestSwatches[nearest.index] = { ...swatch };
      }
    }
    return bestSwatches;
  }
}
