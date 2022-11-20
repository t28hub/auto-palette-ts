import { Color, colorModel } from '../color';
import { Kmeans } from '../kmeans';
import { Pixel } from '../pixel';

import { Extractor } from './extractor';

const NORMALIZE_FACTOR = 128;

export class KmeansExtractor implements Extractor {
  constructor(private readonly kmeans: Kmeans) {}

  extract(imageData: ImageData, maxColors: number): Color[] {
    const { data } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Pixel[] = [];
    const rgbModel = colorModel('rgb');
    const hslModel = colorModel('hsl');
    const labModel = colorModel('lab');
    for (let i = 0; i < data.length; i += 4) {
      const packed = rgbModel.pack({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      });
      const { l, a, b } = labModel.unpack(packed);
      pixels.push([l / NORMALIZE_FACTOR, a / NORMALIZE_FACTOR, b / NORMALIZE_FACTOR]);
    }

    const centers = this.kmeans.classify(pixels, maxColors);
    return centers.map((lab: Pixel): Color => {
      const l = lab[0] * NORMALIZE_FACTOR;
      const a = lab[1] * NORMALIZE_FACTOR;
      const b = lab[2] * NORMALIZE_FACTOR;
      const packed = labModel.pack({ l, a, b, opacity: 1.0 });
      const hslColor = hslModel.unpack(packed);
      return new Color(hslColor.h, hslColor.s, hslColor.l, hslColor.opacity);
    });
  }
}
