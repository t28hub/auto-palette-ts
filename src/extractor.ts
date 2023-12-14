import { CIELabSpace, Color, RGBA, RGBSpace, XYZSpace } from './color';
import { ColorFilterFunction, composeFilters } from './filter';
import { Cluster, ClusteringAlgorithm, DBSCAN, Point3, Point5, denormalize, euclidean, normalize } from './math';
import { Swatch } from './swatch';

/**
 * The color similarity threshold to deduplicate colors.
 *
 * @see {@link https://zschuessler.github.io/DeltaE/learn/#toc-delta-e-101}
 */
const COLOR_DIFFERENCE_THRESHOLD = 2.5;

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
  constructor(private readonly algorithm: ClusteringAlgorithm<Point5>, filters: ColorFilterFunction[]) {
    this.filter = composeFilters(...filters);
  }

  /**
   * Extract swatches from the given image data.
   *
   * @param imageData - The image data to extract swatches from.
   * @param samplingRate - The sampling rate to sample pixels from the image.
   * @return The extracted swatches. If no swatches are extracted, an empty array is returned.
   */
  extract(imageData: ImageData, samplingRate: number): Swatch[] {
    const { data, width, height } = imageData;
    if (data.length === 0 || width === 0 || height === 0) {
      return [];
    }

    const pixels = this.convertToPixels(imageData, samplingRate);
    if (pixels.length === 0) {
      return [];
    }

    const pixelClusters = this.algorithm.fit(pixels);
    if (pixelClusters.length === 0) {
      return [];
    }

    const colors = this.convertToColors(pixelClusters);
    const dbscan = new DBSCAN<Point3>(1, COLOR_DIFFERENCE_THRESHOLD, euclidean);
    const colorClusters = dbscan.fit(colors);
    return colorClusters.reduce((swatches: Swatch[], cluster: Cluster<Point3>): Swatch[] => {
      const swatch = SwatchExtractor.createSwatch(cluster, pixelClusters, width, height);
      if (swatch.population !== 0) {
        swatches.push(swatch);
      }
      return swatches;
    }, []);
  }

  private convertToPixels(imageData: ImageData, samplingRate: number): Point5[] {
    const { data, width, height } = imageData;
    const steps = Math.max(1, Math.floor(1 / samplingRate));
    const pixels: Point5[] = [];
    const channels = Math.floor(data.length / (width * height)); // 4 for RGBA, 3 for RGB
    for (let i = 0; i < data.length; i += channels * steps) {
      const rgba: RGBA = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: channels === 4 ? data[i + 3] : RGBSpace.MAX_RGB,
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
    return pixels;
  }

  private convertToColors(pixelClusters: Cluster<Point5>[]): Point3[] {
    return pixelClusters.reduce((colors: Point3[], cluster: Cluster<Point5>): Point3[] => {
      if (cluster.size === 0) {
        return colors;
      }

      const pixel = cluster.getCentroid();
      const color: Point3 = [
        denormalize(pixel[0], CIELabSpace.MIN_L, CIELabSpace.MAX_L), // L
        denormalize(pixel[1], CIELabSpace.MIN_A, CIELabSpace.MAX_A), // a
        denormalize(pixel[2], CIELabSpace.MIN_B, CIELabSpace.MAX_B), // b
      ];
      colors.push(color);
      return colors;
    }, []);
  }

  /**
   * Create optimal swatch from the given color cluster and pixel clusters.
   *
   * @param colorCluster - The color cluster to create a swatch from.
   * @param pixelClusters - The pixel clusters to create a swatch from.
   * @param width - The width of the source image.
   * @param height - The height of the source image.
   * @returns The optimal swatch.
   */
  private static createSwatch(
    colorCluster: Cluster<Point3>,
    pixelClusters: Cluster<Point5>[],
    width: number,
    height: number,
  ): Swatch {
    const optimalSwatch = {
      l: 0.0,
      a: 0.0,
      b: 0.0,
      x: 0.0,
      y: 0.0,
      size: 0,
      population: 0,
    };
    for (const index of colorCluster.getMemberships().values()) {
      const pixelCluster = pixelClusters[index];
      if (pixelCluster.size === 0) {
        continue;
      }

      const fraction = pixelCluster.size / (pixelCluster.size + optimalSwatch.size);
      const [l, a, b, x, y] = pixelCluster.getCentroid();
      optimalSwatch.l += (l - optimalSwatch.l) * fraction;
      optimalSwatch.a += (a - optimalSwatch.a) * fraction;
      optimalSwatch.b += (b - optimalSwatch.b) * fraction;

      if (fraction >= 0.5) {
        optimalSwatch.x = x;
        optimalSwatch.y = y;
        optimalSwatch.size = pixelCluster.size;
      }
      optimalSwatch.population += pixelCluster.size;
    }

    const color = Color.fromLAB({
      l: denormalize(optimalSwatch.l, CIELabSpace.MIN_L, CIELabSpace.MAX_L),
      a: denormalize(optimalSwatch.a, CIELabSpace.MIN_A, CIELabSpace.MAX_A),
      b: denormalize(optimalSwatch.b, CIELabSpace.MIN_B, CIELabSpace.MAX_B),
    });
    const position = {
      x: Math.floor(optimalSwatch.x * width),
      y: Math.floor(optimalSwatch.y * height),
    };
    const population = optimalSwatch.population;
    return { color, position, population };
  }
}
