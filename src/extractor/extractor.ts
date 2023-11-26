import { CIELabSpace, Color, RGBA, XYZSpace } from '../color';
import { Cluster, ClusteringAlgorithm, DBSCAN, denormalize, euclidean, normalize, Point3, Point5 } from '../math';
import { Swatch } from '../swatch';

import { ColorFilterFunction, composeFilters } from './filter';

/**
 * Class to extract swatches from image data.
 */
export class Extractor {
  private readonly filter: ColorFilterFunction;

  /**
   * Create a new Extractor.
   *
   * @param clustering The clustering algorithm.
   * @param filters The color filter functions
   */
  constructor(
    private readonly clustering: ClusteringAlgorithm<Point5>,
    filters: ColorFilterFunction[],
  ) {
    this.filter = composeFilters(...filters);
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
      const rgba: RGBA = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
      };

      // Exclude colors that do not meet the filter criteria.
      if (!this.filter(rgba)) {
        continue;
      }

      const xyz = XYZSpace.fromRGB(rgba);
      const lab = CIELabSpace.fromXYZ(xyz);
      const x = Math.floor((i / 4) % width);
      const y = Math.floor((i / 4 / width) % height);

      pixels.push([
        normalize(lab.l, CIELabSpace.MIN_L, CIELabSpace.MAX_L),
        normalize(lab.a, CIELabSpace.MIN_A, CIELabSpace.MAX_A),
        normalize(lab.b, CIELabSpace.MIN_B, CIELabSpace.MAX_B),
        normalize(x, 0, width),
        normalize(y, 0, height),
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
      const l = denormalize(pixel[0], CIELabSpace.MIN_L, CIELabSpace.MAX_L);
      const a = denormalize(pixel[1], CIELabSpace.MIN_A, CIELabSpace.MAX_A);
      const b = denormalize(pixel[2], CIELabSpace.MIN_B, CIELabSpace.MAX_B);
      return [l, a, b];
    });
    const dbscan = new DBSCAN<Point3>(1, 2.3, euclidean);
    const colorClusters = dbscan.fit(colors);

    return colorClusters.map((cluster: Cluster<Point3>): Swatch => {
      const [l, a, b, x, y, population] = Extractor.createSwatch(cluster, pixelCluster);
      const color = new Color(
        denormalize(l, CIELabSpace.MIN_L, CIELabSpace.MAX_L),
        denormalize(a, CIELabSpace.MIN_A, CIELabSpace.MAX_A),
        denormalize(b, CIELabSpace.MIN_B, CIELabSpace.MAX_B),
      );
      const coordinate = {
        x: Math.floor(x * width),
        y: Math.floor(y * height),
      };
      return { color, position: coordinate, population };
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
