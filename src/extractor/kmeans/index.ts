import { color, lab, rgb } from '../../color';
import { Point5, SquaredEuclideanDistance } from '../../math';
import { ImageObject, Swatch } from '../../types';
import { Extractor } from '../extractor';

import { Cluster } from './cluster';
import { Kmeans } from './kmeans';

const COLOR_NORMALIZE_FACTOR = 0x80;

const DEFAULT_MAX_ITERATIONS = 10;
const DEFAULT_MIN_DIFFERENCE = 0.25;

/**
 * Implementation of {@link Extractor} using Kmeans algorithm.
 */
export class KmeansExtractor implements Extractor {
  private readonly kmeans: Kmeans<Point5>;

  /**
   * Create a new {@link KmeansExtractor}.
   */
  constructor(maxIterations: number = DEFAULT_MAX_ITERATIONS, minDifference: number = DEFAULT_MIN_DIFFERENCE) {
    this.kmeans = new Kmeans<Point5>('kmeans++', SquaredEuclideanDistance, maxIterations, minDifference);
  }

  extract(imageData: ImageObject<Uint8ClampedArray>, maxColors: number): Swatch[] {
    const { data, width, height } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Point5[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const packed = rgb().encode({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      });
      const { l, a, b } = lab().decode(packed);
      const x = Math.floor((i / 4) % width);
      const y = Math.floor((i / 4 / width) % height);

      // Weight the components corresponding to colors to prioritize color information.
      pixels.push([
        l / COLOR_NORMALIZE_FACTOR,
        a / COLOR_NORMALIZE_FACTOR,
        b / COLOR_NORMALIZE_FACTOR,
        x / width,
        y / height,
      ]);
    }

    const clusters = this.kmeans.classify(pixels, maxColors);
    return clusters.map((cluster: Cluster<Point5>): Swatch => {
      const pixel = cluster.getCentroid();
      const l = pixel[0] * COLOR_NORMALIZE_FACTOR;
      const a = pixel[1] * COLOR_NORMALIZE_FACTOR;
      const b = pixel[2] * COLOR_NORMALIZE_FACTOR;
      const packed = lab().encode({ l, a, b, opacity: 1.0 });

      const x = pixel[3] * width;
      const y = pixel[4] * height;
      return {
        color: color(packed),
        population: cluster.size,
        coordinate: { x, y },
      };
    });
  }
}
