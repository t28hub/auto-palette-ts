import { Color } from './color';
import { SwatchExtractor } from './extractor';
import { ColorFilterFunction, alphaFilter, luminanceFilter } from './filter';
import { ImageSource, createImageData } from './image';
import {
  DBSCAN,
  FarthestPointSampling,
  KDTreeSearch,
  Kmeans,
  KmeansPlusPlusInitializer,
  Neighbor,
  NeighborSearch,
  Point3,
  Point5,
  SamplingStrategy,
  euclidean,
  normalize,
  squaredEuclidean,
} from './math';
import { Swatch } from './swatch';
import { Theme, WeightFunction, getWeightFunction } from './theme';

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

const DEFAULT_OPTIONS: Required<Options> = {
  algorithm: 'dbscan',
  filters: [alphaFilter(), luminanceFilter()],
};

/**
 * Palette class represents a color palette.
 */
export class Palette {
  private readonly swatches: Swatch[];

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
   * @param theme The theme of the swatches.
   * @return The best swatches. If the palette is empty, an empty array is returned.
   * @throws {TypeError} If the number of swatches to find is not an integer or less than 0.
   */
  findSwatches(n: number, theme?: Theme): Swatch[] {
    if (!Number.isInteger(n)) {
      throw new TypeError(`The number of swatches to find must be an integer: ${n}`);
    }
    if (n <= 0) {
      throw new TypeError(`The number of swatches to find must be greater than 0: ${n}`);
    }

    if (n >= this.swatches.length) {
      return [...this.swatches];
    }

    const weightFunction = this.createWeightFunction(theme);
    const sortedSwatches = Array.from(this.swatches).sort((swatch1: Swatch, swatch2: Swatch): number => {
      const weight1 = weightFunction(swatch1);
      const weight2 = weightFunction(swatch2);
      return weight2 - weight1;
    });
    const colors = sortedSwatches.map((swatch: Swatch): Point3 => {
      const { l, a, b } = swatch.color.toLAB();
      return [l, a, b];
    });

    const neighborSearch = KDTreeSearch.build(colors, euclidean);
    const markedIndices = new Set<number>();
    const sampledColors = this.samplingStrategy.sample(colors, n);
    return sampledColors.map(
      (color: Point3): Swatch =>
        Palette.findOptimalSwatch(sortedSwatches, color, neighborSearch, markedIndices, weightFunction),
    );
  }

  private static findOptimalSwatch(
    swatches: Swatch[],
    color: Point3,
    neighborSearch: NeighborSearch<Point3>,
    markedIndices: Set<number>,
    weightFunction: WeightFunction,
  ): Swatch {
    // Find the neighbors of the color within the radius of 20.0 in the LAB color space.
    // The radius is determined by the experiment.
    const neighbors = neighborSearch.searchRadius(color, SIMILAR_COLOR_THRESHOLD);

    // Find the best neighbor which has the largest score.
    const bestNeighbor = neighbors.reduce((optimal: Neighbor, neighbor: Neighbor): Neighbor => {
      const optimalSwatch = swatches[optimal.index];
      const currentSwatch = swatches[neighbor.index];

      // If the neighbor is already marked, the score is reduced by REDUCED_SCORE_COEFFICIENT to avoid duplication.
      const coefficient = markedIndices.has(neighbor.index) ? REDUCED_SCORE_COEFFICIENT : DEFAULT_SCORE_COEFFICIENT;
      markedIndices.add(neighbor.index);

      const optimalWeight = weightFunction(optimalSwatch);
      const currentWeight = weightFunction(currentSwatch) * coefficient;
      if (optimalWeight > currentWeight) {
        return optimal;
      }
      return neighbor;
    });
    return swatches[bestNeighbor.index];
  }

  /**
   * Create a new WeightFunction instance with the given theme.
   *
   * @param theme - The theme of the swatches.
   * @return A new WeightFunction instance. If the theme is not specified, a default WeightFunction instance is returned.
   */
  private createWeightFunction(theme?: Theme): WeightFunction {
    if (theme) {
      return getWeightFunction(theme);
    }

    // The swatch at the first index is the dominant swatch and has the largest population.
    const maxPopulation = this.swatches[0].population;
    return (swatch: Swatch): number => {
      const population = normalize(swatch.population, 0, maxPopulation);
      const chroma = normalize(swatch.color.chroma(), Color.MIN_CHROMA, Color.MAX_CHROMA);
      return population * 0.8 + chroma * 0.2;
    };
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
    }
    const dbscan = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
    return new SwatchExtractor(dbscan, [...filters]);
  }
}
