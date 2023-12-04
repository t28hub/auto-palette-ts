import { SwatchCollection } from './collection';
import { SwatchExtractor } from './extractor';
import { alphaFilter, ColorFilterFunction, luminanceFilter } from './filter';
import { createImageData, ImageSource } from './image';
import {
  DBSCAN,
  euclidean,
  FarthestPointSampling,
  Kmeans,
  KmeansPlusPlusInitializer,
  Point3,
  Point5,
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

const DEFAULT_SWATCH_COUNT = 6;

const DEFAULT_OPTIONS: Required<Options> = {
  algorithm: 'dbscan',
  filters: [alphaFilter(), luminanceFilter()],
};

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
