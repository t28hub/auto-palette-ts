import { euclidean, KDTreeSearch, Neighbor, Point3, RandomSampling, SamplingStrategy } from './math';
import { Swatch } from './swatch';

const SIMILAR_COLOR_THRESHOLD = 20.0;
const DEFAULT_SCORE_COEFFICIENT = 1.0;
const REDUCED_SCORE_COEFFICIENT = 0.25;

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

    const marked = new Set<number>();
    const neighborSearch = KDTreeSearch.build(this.colors, euclidean);
    return sampled.map((color: Point3): Swatch => {
      // Find the neighbors of the color within the radius of 20.0 in the LAB color space.
      // The radius is determined by the experiment.
      const neighbors = neighborSearch.searchRadius(color, SIMILAR_COLOR_THRESHOLD);
      // Sort the neighbors by distance in ascending order.
      neighbors.sort((neighbor1: Neighbor, neighbor2: Neighbor): number => {
        return neighbor1.distance - neighbor2.distance;
      });

      // Find the best neighbor which has the largest score.
      const bestNeighbor = neighbors.reduce((best: Neighbor, neighbor: Neighbor): Neighbor => {
        const bestSwatch = this.swatches[best.index];
        const currentSwatch = this.swatches[neighbor.index];

        // If the neighbor is already marked, the score is reduced by REDUCED_SCORE_COEFFICIENT to avoid duplication.
        const coefficient = marked.has(neighbor.index) ? REDUCED_SCORE_COEFFICIENT : DEFAULT_SCORE_COEFFICIENT;
        marked.add(neighbor.index);

        const bestScore = bestSwatch.population * bestSwatch.color.chroma();
        const currentScore = currentSwatch.population * currentSwatch.color.chroma() * coefficient;
        if (bestScore > currentScore) {
          return best;
        }
        return neighbor;
      });
      return this.swatches[bestNeighbor.index];
    });
  }
}
