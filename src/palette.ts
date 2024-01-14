import { SwatchExtractor } from './extractor';
import { ColorFilter, luminanceFilter, opacityFilter } from './filter';
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
  squaredEuclidean,
} from './math';
import { Swatch } from './swatch';
import {
  BasicThemeStrategy,
  DarkThemeStrategy,
  LightThemeStrategy,
  MutedThemeStrategy,
  Theme,
  ThemeStrategy,
  VividThemeStrategy,
  visit,
} from './theme';
import { assert, assertPositiveInteger } from './utils';

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
   * The sampling rate to sample pixels from the image in the range of (0, 1]. Default is 1.0.
   */
  readonly samplingRate?: number;

  /**
   * The maximum number of swatches to extract. Default is 256.
   */
  readonly maxSwatches?: number;

  /**
   * The color filter functions. Default is [opacityFilter(), luminanceFilter()].
   *
   * @see {@link opacityFilter}
   * @see {@link luminanceFilter}
   */
  readonly filters?: ColorFilter[];
}

const SIMILAR_COLOR_THRESHOLD = 20.0;

const MIN_SCORE_COEFFICIENT = 0.0;
const MAX_SCORE_COEFFICIENT = 1.0;
const REDUCED_SCORE_COEFFICIENT = 0.5;

const LOWER_SAMPLING_RATE = 0.0;
const UPPER_SAMPLING_RATE = 1.0;

const DEFAULT_OPTIONS: Required<Options> = {
  algorithm: 'dbscan',
  samplingRate: 1.0,
  maxSwatches: 256,
  filters: [opacityFilter(), luminanceFilter()],
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
    this.swatches = Array.from(swatches);
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
   * Find the best swatches from the palette.
   *
   * @param n The number of swatches to find.
   * @param theme The theme of the swatches. Default is basic.
   * @return The best swatches. If the palette is empty, an empty array is returned.
   * @throws {TypeError} If the number of swatches to find is not an integer or less than 0.
   */
  findSwatches(n: number, theme: Theme = 'basic'): Swatch[] {
    assertPositiveInteger(n, `The number of swatches to find must be a positive integer: ${n}`);
    if (n >= this.swatches.length) {
      return [...this.swatches];
    }

    const themeStrategy = this.createThemeStrategy(theme);
    const candidates = this.swatches.filter((swatch: Swatch) => themeStrategy.filter(swatch));
    if (candidates.length === 0) {
      return [];
    }

    const colors = candidates.map((swatch: Swatch): Point3 => {
      const { l, a, b } = swatch.color.toLAB();
      return [l, a, b];
    });

    const neighborSearch = KDTreeSearch.build(colors, euclidean);
    const coefficients = new Array<number>(colors.length).fill(MAX_SCORE_COEFFICIENT);
    const sampledColors = this.samplingStrategy.sample(colors, n);
    return sampledColors.map((color: Point3): Swatch => {
      return Palette.findOptimalSwatch(candidates, color, neighborSearch, coefficients, themeStrategy);
    });
  }

  private createThemeStrategy(theme: Theme): ThemeStrategy {
    return visit<Swatch, ThemeStrategy>(
      theme,
      {
        visitBasic(swatch: Swatch): ThemeStrategy {
          // The swatch at the first index is the dominant swatch and has the largest population.
          return new BasicThemeStrategy(swatch.population);
        },
        visitVivid(_swatch: Swatch): ThemeStrategy {
          return new VividThemeStrategy();
        },
        visitMuted(_swatch: Swatch): ThemeStrategy {
          return new MutedThemeStrategy();
        },
        visitLight(_swatch: Swatch): ThemeStrategy {
          return new LightThemeStrategy();
        },
        visitDark(_swatch: Swatch): ThemeStrategy {
          return new DarkThemeStrategy();
        },
      },
      this.swatches[0],
    );
  }

  private static findOptimalSwatch(
    swatches: Swatch[],
    color: Point3,
    neighborSearch: NeighborSearch<Point3>,
    coefficients: number[],
    strategy: ThemeStrategy,
  ): Swatch {
    // Find the neighbors of the color within the radius of 20.0 in the LAB color space.
    // The radius is determined by the experiment.
    const neighbors = neighborSearch.searchRadius(color, SIMILAR_COLOR_THRESHOLD);

    // Find the best neighbor which has the largest score.
    const bestNeighbor = neighbors.reduce((optimal: Neighbor, neighbor: Neighbor): Neighbor => {
      const optimalSwatch = swatches[optimal.index];
      const currentSwatch = swatches[neighbor.index];

      const optimalCoefficient = coefficients[optimal.index];
      const currentCoefficient = coefficients[neighbor.index];

      // Reduce the score coefficient of the current swatch to avoid selecting the same color.
      coefficients[neighbor.index] = currentCoefficient * REDUCED_SCORE_COEFFICIENT;

      const optimalWeight = strategy.score(optimalSwatch) * optimalCoefficient;
      const currentWeight = strategy.score(currentSwatch) * currentCoefficient;
      if (optimalWeight > currentWeight) {
        return optimal;
      }
      return neighbor;
    });
    coefficients[bestNeighbor.index] = MIN_SCORE_COEFFICIENT;
    return swatches[bestNeighbor.index];
  }

  /**
   * Extract a color palette from the given image source.
   *
   * @param source The source of the image.
   * @param options The options for palette extraction.
   * @return A new Palette instance containing the extracted swatches.
   */
  static extract(source: ImageSource, options: Partial<Options> = {}): Palette {
    const { algorithm, samplingRate, maxSwatches, filters } = { ...DEFAULT_OPTIONS, ...options };
    assert(
      Number.isFinite(samplingRate) && samplingRate > LOWER_SAMPLING_RATE && samplingRate <= UPPER_SAMPLING_RATE,
      `The sampling rate must be in the range of (${LOWER_SAMPLING_RATE}, ${UPPER_SAMPLING_RATE}]: ${samplingRate}`,
    );
    assertPositiveInteger(maxSwatches, `The maximum number of swatches must be a positive integer: ${maxSwatches}`);

    const extractor = Palette.createExtractor(algorithm, filters);
    const imageData = createImageData(source);
    const swatches = extractor.extract(imageData, samplingRate);
    swatches.sort((swatch1: Swatch, swatch2: Swatch): number => {
      return swatch2.population - swatch1.population;
    });
    return new Palette(swatches.slice(0, maxSwatches));
  }

  /**
   * Create a new SwatchExtractor instance with the given algorithm and filters.
   *
   * @param algorithm - The clustering algorithm to use.
   * @param filters - The color filter functions to use.
   * @return A new SwatchExtractor instance.
   */
  private static createExtractor(algorithm: Algorithm, filters: ColorFilter[]): SwatchExtractor {
    if (algorithm === 'kmeans') {
      const strategy = new KmeansPlusPlusInitializer<Point5>(squaredEuclidean);
      const kmeans = new Kmeans<Point5>(32, 10, 0.0001, squaredEuclidean, strategy);
      return new SwatchExtractor(kmeans, [...filters]);
    }
    const dbscan = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
    return new SwatchExtractor(dbscan, [...filters]);
  }
}
