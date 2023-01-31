import { lab, parse, rgb } from '../color';
import { MAX_A, MAX_B, MAX_L, MIN_A, MIN_B, MIN_L } from '../color/space/lab';
import { Cluster, Clustering, Point5 } from '../math';
import { ColorSpace, ImageObject, Lab, RGB, Swatch } from '../types';

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
  extract(imageData: ImageObject<Uint8ClampedArray>): Swatch[] {
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

    return this.clustering.fit(pixels).map((cluster: Cluster<Point5>): Swatch => {
      const pixel = cluster.computeCentroid();
      const l = pixel[0] * (MAX_L - MIN_L) + MIN_L;
      const a = pixel[1] * (MAX_A - MIN_A) + MIN_A;
      const b = pixel[2] * (MAX_B - MIN_B) + MIN_B;
      const packed = this.lab.encode({ l, a, b, opacity: 1.0 });

      const x = Math.round(pixel[3] * width);
      const y = Math.round(pixel[4] * height);
      return {
        color: parse(packed),
        population: cluster.size,
        coordinate: { x, y },
      };
    });
  }
}
