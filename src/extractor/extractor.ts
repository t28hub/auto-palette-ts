import { ciede2000, lab, parse, rgb } from '../color';
import { MAX_A, MAX_B, MAX_L, MIN_A, MIN_B, MIN_L } from '../color/space/lab';
import { Cluster, Clustering, HierarchicalClustering, Point3, Point5, WeightFunction } from '../math';
import { ColorSpace, Lab, RGB, Swatch } from '../types';

import { DeltaEWeightFunction } from './deltaEWeightFunction';
import { ColorFilter, composite } from './filter';
import { FeaturePoint } from './types';

const MAX_COLOR_COUNT = 64;

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
  constructor(private readonly clustering: Clustering<Point5>, filters: ColorFilter<RGB>[]) {
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

      // Exclude colors with high opacity
      if (!this.filter.test(color)) {
        continue;
      }

      const packed = this.rgb.encode(color);
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

    const features = this.clustering.fit(pixels).map((cluster: Cluster<Point5>): FeaturePoint => {
      const pixel = cluster.computeCentroid();
      const l = pixel[0] * (MAX_L - MIN_L) + MIN_L;
      const a = pixel[1] * (MAX_A - MIN_A) + MIN_A;
      const b = pixel[2] * (MAX_B - MIN_B) + MIN_B;
      const x = Math.round(pixel[3] * width);
      const y = Math.round(pixel[4] * height);
      return { l, a, b, x, y, size: cluster.size };
    });

    return Extractor.mergeFeatures(features).map((feature: FeaturePoint): Swatch => {
      const packed = this.lab.encode({
        l: feature.l,
        a: feature.a,
        b: feature.b,
        opacity: 1.0,
      });

      return {
        color: parse(packed),
        population: feature.size,
        coordinate: {
          x: feature.x,
          y: feature.y,
        },
      };
    });
  }

  private static mergeFeatures(features: FeaturePoint[]): FeaturePoint[] {
    const colors: Point3[] = features.map((feature: FeaturePoint): Point3 => {
      return [feature.l, feature.a, feature.b];
    });
    const weightFunction: WeightFunction = new DeltaEWeightFunction(colors, ciede2000());
    const hierarchicalClustering = new HierarchicalClustering(MAX_COLOR_COUNT, weightFunction);
    const labels = hierarchicalClustering.label(colors);
    const merged = features.reduce(
      (merged: Map<number, FeaturePoint>, feature: FeaturePoint, index: number): Map<number, FeaturePoint> => {
        const label = labels[index];
        const previous = merged.get(label);
        if (!previous || previous.size < feature.size) {
          merged.set(label, feature);
        }
        return merged;
      },
      new Map<number, FeaturePoint>(),
    );
    return Array.from(merged.values());
  }
}
