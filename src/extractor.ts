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
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      pixels.push([r, g, b]);
    }

    const centers = this.kmeans.classify(pixels, maxColor);
    return centers.map((color: Pixel): string => {
      return color.reduce((hex: string, value: number): string => {
        const component = Math.floor(value * 0xff) & 0xff;
        const string = component.toString(16).padStart(2, '0');
        return `${hex}${string}`;
      }, '#');
    });
  }
}
