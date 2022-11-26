import { Color, colorModel } from '../color';
import { Cluster, Kmeans } from '../kmeans';
import { Point5 } from '../math';

import { Extractor, ExtractionResult } from './extractor';

const COLOR_NORMALIZE_FACTOR = 128;
const COLOR_COMPONENT_WEIGHT = 16;

/**
 * Implementation of {@link Extractor} using Kmeans algorithm.
 */
export class KmeansExtractor implements Extractor {
  constructor(private readonly kmeans: Kmeans<Point5>) {}

  extract(imageData: ImageData, maxColors: number): ExtractionResult<Color>[] {
    const { data, width, height } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Point5[] = [];
    const rgbModel = colorModel('rgb');
    const labModel = colorModel('lab');
    for (let i = 0; i < data.length; i += 4) {
      const packed = rgbModel.pack({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      });
      const { l, a, b } = labModel.unpack(packed);
      const x = Math.floor((i / 4) % width);
      const y = Math.floor((i / 4 / width) % height);

      // Weight the components corresponding to colors to prioritize color information.
      pixels.push([
        (l / COLOR_NORMALIZE_FACTOR) * COLOR_COMPONENT_WEIGHT,
        (a / COLOR_NORMALIZE_FACTOR) * COLOR_COMPONENT_WEIGHT,
        (b / COLOR_NORMALIZE_FACTOR) * COLOR_COMPONENT_WEIGHT,
        x / width,
        y / height,
      ]);
    }

    const clusters = this.kmeans.classify(pixels, maxColors);
    return clusters.map((cluster: Cluster<Point5>): ExtractionResult<Color> => {
      const pixel = cluster.getCentroid();
      const l = (pixel[0] * COLOR_NORMALIZE_FACTOR) / COLOR_COMPONENT_WEIGHT;
      const a = (pixel[1] * COLOR_NORMALIZE_FACTOR) / COLOR_COMPONENT_WEIGHT;
      const b = (pixel[2] * COLOR_NORMALIZE_FACTOR) / COLOR_COMPONENT_WEIGHT;
      const packed = labModel.pack({ l, a, b, opacity: 1.0 });
      return {
        population: cluster.size,
        color: Color.fromPackedColor(packed),
      };
    });
  }
}
