import { SwatchExtractor } from './extractor';
import { alphaFilter, ColorFilterFunction, luminanceFilter } from './filter';
import { createImageData, ImageSource } from './image';
import {
  DBSCAN,
  euclidean,
  FarthestPointSampling,
  KDTreeSearch,
  Kmeans,
  KmeansPlusPlusInitializer,
  Neighbor,
  NeighborSearch,
  Point3,
  Point5,
  SamplingStrategy,
  squaredEuclidean,
} from './math';
import { Swatch } from './swatch';

/**
 * The algorithm to use for palette extraction.
 * dbscan: Density-based spatial clustering of applications with noise(DBSCAN) clustering.
 * kmeans: K-means clustering.
 *
 * @see [DBSCAN - Wikipedia](https://en.wikipedia.org/wiki/DBSCAN)
 * @see [k-means clustering - Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)
 */
export type Algorithm = 'dbscan' | 'kmeans';

/**
 * Options interface for palette extraction.
 *
 * @see {@link Palette.extract}
 */
export interface Options {
  /**
   * The algorithm to use for palette extraction. Default is dbscan.
   */
  readonly algorithm?: Algorithm;

  /**
   * The color filter functions. Default is [alphaFilter(), luminanceFilter()].
   *
   * @see {@link alphaFilter}
   * @see {@link luminanceFilter}
   */
  readonly filters?: ColorFilterFunction[];
}

const SIMILAR_COLOR_THRESHOLD = 20.0;
const DEFAULT_SCORE_COEFFICIENT = 1.0;
const REDUCED_SCORE_COEFFICIENT = 0.25;
const DEFAULT_SWATCH_COUNT = 6;

const DEFAULT_OPTIONS: Required<Options> = {
  algorithm: 'dbscan',
  filters: [alphaFilter(), luminanceFilter()],
};

/**
 * Palette class represents a color palette.
 */
export class Palette {
  private readonly swatches: Swatch[];

  private readonly colors: Point3[];

  private readonly samplingStrategy: SamplingStrategy<Point3>;

  /**
   * Create a new Palette instance.
   *
   * @param swatches - The swatches of the palette.
   * @see {@link Palette.extract}
   */
  constructor(swatches: Swatch[]) {
    // Sort the swatches by population in descending order to make the dominant swatch easier to find.
    this.swatches = Array.from(swatches).sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    });
    this.colors = this.swatches.map((swatch: Swatch): Point3 => {
      const { l, a, b } = swatch.color.toLAB();
      return [l, a, b];
    });
    this.samplingStrategy = new FarthestPointSampling<Point3>(euclidean);
  }

  /**
   * Return the number of swatches.
   *
   * @return The number of swatches.
   * @see {@link Palette.isEmpty}
   */
  size(): number {
    return this.swatches.length;
  }

  /**
   * Check whether the palette is empty.
   *
   * @return True if the palette is empty, false otherwise.
   * @see {@link Palette.size}
   */
  isEmpty(): boolean {
    return this.swatches.length === 0;
  }

  /**
   * Return the dominant swatch of the palette.
   *
   * @return The dominant swatch. If the palette is empty, undefined is returned.
   * @see {@link Palette.isEmpty}
   * @see {@link Palette.findSwatches}
   */
  getDominantSwatch(): Swatch | undefined {
    const dominantSwatch = this.swatches[0];
    return dominantSwatch ? { ...dominantSwatch } : undefined;
  }

  /**
   * Find the best swatches from the palette.
   *
   * @param n The number of swatches to find.
   * @return The best swatches. If the palette is empty, an empty array is returned.
   * @throws {TypeError} If the number of swatches to find is not an integer or less than 0.
   */
  findSwatches(n: number = DEFAULT_SWATCH_COUNT): Swatch[] {
    if (!Number.isInteger(n)) {
      throw new TypeError(`The number of swatches to find must be an integer: ${n}`);
    }
    if (n <= 0) {
      throw new TypeError(`The number of swatches to find must be greater than 0: ${n}`);
    }

    if (n >= this.swatches.length) {
      return [...this.swatches];
    }

    const neighborSearch = KDTreeSearch.build(this.colors, euclidean);
    const markedIndices = new Set<number>();
    const sampledColors = this.samplingStrategy.sample(this.colors, n);
    return sampledColors.map((color: Point3): Swatch => this.findBestSwatch(color, neighborSearch, markedIndices));
  }

  private findBestSwatch(color: Point3, neighborSearch: NeighborSearch<Point3>, marked: Set<number>): Swatch {
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
  }

  /**
   * Extract a color palette from the given image source.
   *
   * @param source The source of the image.
   * @param options The options for palette extraction.
   * @return A new Palette instance containing the extracted swatches.
   */
  static extract(source: ImageSource, options: Partial<Options> = {}): Palette {
    const { algorithm, filters } = { ...DEFAULT_OPTIONS, ...options };
    const extractor = Palette.createExtractor(algorithm, filters);
    const imageData = createImageData(source);
    const swatches = extractor.extract(imageData);
    return new Palette(swatches);
  }

  /**
   * Create a new SwatchExtractor instance with the given algorithm and filters.
   *
   * @param algorithm - The clustering algorithm to use.
   * @param filters - The color filter functions to use.
   * @return A new SwatchExtractor instance.
   */
  private static createExtractor(algorithm: Algorithm, filters: ColorFilterFunction[]): SwatchExtractor {
    if (algorithm === 'kmeans') {
      const strategy = new KmeansPlusPlusInitializer<Point5>(squaredEuclidean);
      const kmeans = new Kmeans<Point5>(32, 10, 0.0001, squaredEuclidean, strategy);
      return new SwatchExtractor(kmeans, [...filters]);
    } else {
      const dbscan = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      return new SwatchExtractor(dbscan, [...filters]);
    }
  }
}
