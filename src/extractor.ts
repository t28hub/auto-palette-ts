import { CIELabSpace, Color, RGBA, XYZSpace } from './color';
import { ColorFilterFunction, composeFilters } from './filter';
import { Cluster, ClusteringAlgorithm, DBSCAN, denormalize, euclidean, normalize, Point3, Point5 } from './math';
import { Swatch } from './swatch';

/**
 * SwatchExtractor class extracts swatches from an image.
 */
export class SwatchExtractor {
  private readonly filter: ColorFilterFunction;

  /**
   * Create a new SwatchExtractor instance.
   *
   * @param algorithm - The clustering algorithm to use.
   * @param filters - The color filter functions to use.
   */
  constructor(
    private readonly algorithm: ClusteringAlgorithm<Point5>,
    filters: ColorFilterFunction[],
  ) {
    this.filter = composeFilters(...filters);
  }

  /**
   * Extract swatches from the given image data.
   *
   * @param imageData - The image data to extract swatches from.
   * @return The extracted swatches. If no swatches are extracted, an empty array is returned.
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
        x / width,
        y / height,
      ]);
    }

    if (pixels.length === 0) {
      return [];
    }

    const pixelClusters = this.algorithm.fit(pixels);
    if (pixelClusters.length === 0) {
      return [];
    }

    const colors = pixelClusters.reduce((acc: Point3[], cluster: Cluster<Point5>): Point3[] => {
      if (cluster.size === 0) {
        return acc;
      }

      const pixel = cluster.getCentroid();
      const color: Point3 = [
        denormalize(pixel[0], CIELabSpace.MIN_L, CIELabSpace.MAX_L), // L
        denormalize(pixel[1], CIELabSpace.MIN_A, CIELabSpace.MAX_A), // a
        denormalize(pixel[2], CIELabSpace.MIN_B, CIELabSpace.MAX_B), // b
      ];
      return [...acc, color];
    }, []);
    const dbscan = new DBSCAN<Point3>(1, 2.3, euclidean);
    const colorClusters = dbscan.fit(colors);

    return colorClusters.reduce((swatches: Swatch[], cluster: Cluster<Point3>): Swatch[] => {
      const [l, a, b, x, y, population] = SwatchExtractor.createSwatch(cluster, pixelClusters);
      if (population === 0) {
        return swatches;
      }

      const swatch: Swatch = {
        color: new Color(
          denormalize(l, CIELabSpace.MIN_L, CIELabSpace.MAX_L),
          denormalize(a, CIELabSpace.MIN_A, CIELabSpace.MAX_A),
          denormalize(b, CIELabSpace.MIN_B, CIELabSpace.MAX_B),
        ),
        position: {
          x: Math.floor(x * width),
          y: Math.floor(y * height),
        },
        population,
      };
      return [...swatches, swatch];
    }, []);
  }

  /**
   * Create best swatch from the given color cluster and pixel clusters.
   *
   * @param colorCluster - The color cluster to create a swatch from.
   * @param pixelClusters - The pixel clusters to create a swatch from.
   * @return The array of the best swatch properties.
   */
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
      if (pixelCluster.size === 0) {
        return;
      }
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
