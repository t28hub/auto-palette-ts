import { color, lab, rgb } from '../../color';
import {
  MAX_A,
  MAX_B,
  MAX_L,
  MIN_A,
  MIN_B,
  MIN_L,
} from '../../color/space/lab';
import { Point5, SquaredEuclideanDistance } from '../../math';
import { ColorSpace, ImageObject, Lab, RGB, Swatch } from '../../types';
import { Extractor } from '../extractor';

import { Cluster } from './cluster';
import { Kmeans } from './kmeans';

const DEFAULT_MAX_ITERATIONS = 10;
const DEFAULT_MIN_DIFFERENCE = 0.25;

/**
 * Implementation of {@link Extractor} using Kmeans algorithm.
 */
export class KmeansExtractor implements Extractor {
  private readonly rgb: ColorSpace<RGB>;
  private readonly lab: ColorSpace<Lab>;
  private readonly kmeans: Kmeans<Point5>;

  /**
   * Create a new {@link KmeansExtractor}.
   */
  constructor(
    maxIterations: number = DEFAULT_MAX_ITERATIONS,
    minDifference: number = DEFAULT_MIN_DIFFERENCE,
  ) {
    this.rgb = rgb();
    this.lab = lab();
    this.kmeans = new Kmeans<Point5>(
      'kmeans++',
      SquaredEuclideanDistance,
      maxIterations,
      minDifference,
    );
  }

  extract(
    imageData: ImageObject<Uint8ClampedArray>,
    maxColors: number,
  ): Swatch[] {
    const { data, width, height } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Point5[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const packed = this.rgb.encode({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      });
      const { l, a, b } = this.lab.decode(packed);
      const x = Math.floor((i / 4) % width);
      const y = Math.floor((i / 4 / width) % height);

      // Normalize each value to a range of [0, 1].
      pixels.push([
        (l - MIN_L) / (MAX_L - MIN_L),
        (a - MIN_A) / (MAX_A - MIN_A),
        (b - MIN_B) / (MAX_B - MIN_B),
        x / width,
        y / height,
      ]);
    }

    const clusters = this.kmeans.classify(pixels, maxColors);
    return clusters.map((cluster: Cluster<Point5>): Swatch => {
      const pixel = cluster.getCentroid();
      const l = pixel[0] * (MAX_L - MIN_L) + MIN_L;
      const a = pixel[1] * (MAX_A - MIN_A) + MIN_A;
      const b = pixel[2] * (MAX_B - MIN_B) + MIN_B;
      const packed = this.lab.encode({ l, a, b, opacity: 1.0 });

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
