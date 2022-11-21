import { Color, colorModel } from '../color';
import { Kmeans } from '../kmeans';
import { Point5 } from '../math';

import { Extractor } from './extractor';

const COLOR_NORMALIZE_FACTOR = 128;
const COLOR_COMPONENT_WEIGHT = 16;

export class KmeansExtractor implements Extractor {
  constructor(private readonly kmeans: Kmeans<Point5>) {}

  extract(imageData: ImageData, maxColors: number): Color[] {
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

    const centers = this.kmeans.classify(pixels, maxColors);
    return centers.map((point: Point5): Color => {
      const l = (point[0] * COLOR_NORMALIZE_FACTOR) / COLOR_COMPONENT_WEIGHT;
      const a = (point[1] * COLOR_NORMALIZE_FACTOR) / COLOR_COMPONENT_WEIGHT;
      const b = (point[2] * COLOR_NORMALIZE_FACTOR) / COLOR_COMPONENT_WEIGHT;
      const packed = labModel.pack({ l, a, b, opacity: 1.0 });
      return Color.fromPackedColor(packed);
    });
  }
}
