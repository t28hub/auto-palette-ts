import { load } from './image';
import { Palette, PaletteGenerator } from './palette';
import { timed } from './utils';

const MAX_IMAGE_SIZE = 192 * 192;

export function fromImage(imageElement: HTMLImageElement): Promise<Palette> {
  if (!imageElement.complete) {
    throw new TypeError(`Image(src=${imageElement.src}) is not loaded`);
  }

  try {
    const image = load(imageElement).resize(MAX_IMAGE_SIZE);
    const imageData = image.getImageData();
    const generator = new PaletteGenerator();
    return timed('palette', () => generator.generate(imageData, 8));
  } catch (e) {
    throw new Error('Failed to get ImageData from an image');
  }
}
