import { load } from './image';
import { Palette, PaletteBuilder } from './palette';
import { Options } from './types';

const defaults: Options = {
  algorithm: 'kmeans',
  maxColors: 5,
  maxImageSize: 128 * 128,
} as const;

export async function fromImage(imageElement: HTMLImageElement, options: Partial<Options> = {}): Promise<Palette> {
  const { algorithm, maxColors, maxImageSize } = { ...defaults, ...options };
  const image = await load(imageElement);
  const resized = image.resize(maxImageSize);
  const imageData = resized.getImageData();
  const builder = new PaletteBuilder();
  return await builder.build(imageData, algorithm, maxColors);
}
