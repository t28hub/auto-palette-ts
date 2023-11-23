import { lab, parse, rgb } from '../color';
import { MAX_A, MAX_B, MAX_L, MIN_A, MIN_B, MIN_L } from '../color/space/lab';
import { Cluster, ClusteringAlgorithm, DBSCAN, euclidean, Point3, Point5 } from '../math';
import { ColorSpace, Lab, RGB, Swatch } from '../types';

import { ColorFilter, composite } from './filter';

/**
 * Class to extract swatches from image data.
 */
export class Extractor {
  private readonly rgb: ColorSpace<RGB>;
  private readonly lab: ColorSpace<Lab>;
  private readonly filter: ColorFilter<RGB>;

  /**
   * Create a new Extractor.
   *
   * @param clustering The clustering algorithm.
   * @param filters The color filters.
   */
  constructor(
    private readonly clustering: ClusteringAlgorithm<Point5>,
    filters: ColorFilter<RGB>[],
  ) {
    this.rgb = rgb();
    this.lab = lab();
    this.filter = composite(...filters);
  }

  /**
   * Extract colors from image data.
   *
   * @param imageData The image data.
   * @return The extracted swatches.
   */
  extract(imageData: ImageData): Swatch[] {
    const { data, width, height } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Point5[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const color = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      };

      // Exclude colors that do not meet the filter criteria.
      if (!this.filter.test(color)) {
        continue;
      }

      const packed = this.rgb.encode(color);
      const { l, a, b } = this.lab.decode(packed);
      const x = Math.floor((i / 4) % width);
      const y = Math.floor((i / 4 / width) % height);

      // Normalize each value to a range of [0, 1] for better clustering.
      pixels.push([
        (l - MIN_L) / (MAX_L - MIN_L),
        (a - MIN_A) / (MAX_A - MIN_A),
        (b - MIN_B) / (MAX_B - MIN_B),
        x / width,
        y / height,
      ]);
    }

    if (pixels.length === 0) {
      return [];
    }

    const pixelCluster = this.clustering.fit(pixels);
    if (pixelCluster.length === 0) {
      return [];
    }

    const colors = pixelCluster.map((cluster: Cluster<Point5>): Point3 => {
      const pixel = cluster.getCentroid();
      const l = pixel[0] * (MAX_L - MIN_L) + MIN_L;
      const a = pixel[1] * (MAX_A - MIN_A) + MIN_A;
      const b = pixel[2] * (MAX_B - MIN_B) + MIN_B;
      return [l, a, b];
    });
    const dbscan = new DBSCAN<Point3>(1, 2.3, euclidean);
    const colorClusters = dbscan.fit(colors);

    return colorClusters.map((cluster: Cluster<Point3>): Swatch => {
      const [l, a, b, x, y, population] = Extractor.createSwatch(cluster, pixelCluster);
      const lab = {
        l: l * (MAX_L - MIN_L) + MIN_L,
        a: a * (MAX_A - MIN_A) + MIN_A,
        b: b * (MAX_B - MIN_B) + MIN_B,
        opacity: 1.0,
      };
      const color = parse(this.lab.encode(lab));
      const coordinate = {
        x: Math.floor(x * width),
        y: Math.floor(y * height),
      };
      return { color, coordinate, population };
    });
  }

  private static createSwatch(colorCluster: Cluster<Point3>, pixelClusters: Cluster<Point5>[]): number[] {
    const bestSwatch = {
      l: 0.0,
      a: 0.0,
      b: 0.0,
      x: 0.0,
      y: 0.0,
      size: 0.0,
    };
    let population = 0;
    colorCluster.getMemberships().forEach((index: number) => {
      const pixelCluster = pixelClusters[index];
      const fraction = pixelCluster.size / (pixelCluster.size + bestSwatch.size);

      const [l, a, b, x, y] = pixelCluster.getCentroid();
      bestSwatch.l += (l - bestSwatch.l) * fraction;
      bestSwatch.a += (a - bestSwatch.a) * fraction;
      bestSwatch.b += (b - bestSwatch.b) * fraction;

      if (fraction >= 0.5) {
        bestSwatch.x = x;
        bestSwatch.y = y;
        bestSwatch.size = pixelCluster.size;
      }
      population += pixelCluster.size;
    });
    return [bestSwatch.l, bestSwatch.a, bestSwatch.b, bestSwatch.x, bestSwatch.y, population];
  }
}
