import { Color, colorModel } from './color';
import { Kmeans } from './kmeans';
import { SquaredEuclideanDistance } from './math';
import { Pixel } from './pixel';

const DEFAULT_MAX_COLOR = 10;

export class Extractor {
  private readonly kmeans: Kmeans;

  constructor() {
    this.kmeans = new Kmeans('kmeans++', SquaredEuclideanDistance);
  }

  extract(imageData: ImageData, maxColor: number = DEFAULT_MAX_COLOR): Color[] {
    const { data } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Pixel[] = [];
    const rgbModel = colorModel('rgb');
    const hslModel = colorModel('hsl');
    for (let i = 0; i < data.length; i += 4) {
      const packed = rgbModel.pack({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      });
      const { h, s, l } = hslModel.unpack(packed);
      pixels.push([h, s, l]);
    }

    const centers = this.kmeans.classify(pixels, maxColor);
    return centers.map((hsl: Pixel): Color => new Color(hsl[0], hsl[1], hsl[2], 1.0));
  }
}
