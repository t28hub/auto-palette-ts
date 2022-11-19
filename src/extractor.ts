import { colorModel } from './color';
import { Kmeans } from './kmeans';
import { SquaredEuclideanDistance } from './math';
import { Pixel } from './pixel';

const DEFAULT_MAX_COLOR = 10;

export class Extractor {
  private readonly kmeans: Kmeans;

  constructor() {
    this.kmeans = new Kmeans('kmeans++', SquaredEuclideanDistance);
  }

  extract(imageData: ImageData, maxColor: number = DEFAULT_MAX_COLOR): string[] {
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
    return centers.map((hsl: Pixel): string => {
      const packed = hslModel.pack({
        h: hsl[0],
        s: hsl[1],
        l: hsl[2],
        opacity: 1.0,
      });
      const { r, g, b } = rgbModel.unpack(packed);
      return [r, g, b].reduce((hex: string, value: number): string => {
        const component = value & 0xff;
        const string = component.toString(16).padStart(2, '0');
        return `${hex}${string}`;
      }, '#');
    });
  }
}
