import { Color } from './color';
import { PaletteGenerator } from './palette';
import { timed } from './utils';

export function fromImage(image: HTMLImageElement): Promise<Color[]> {
  if (!image.complete) {
    throw new Error(`Image(src=${image.src}) is not loaded`);
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to retrieve 2d context from canvas');
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return fromCanvas(canvas);
}

export function fromCanvas(canvas: HTMLCanvasElement): Promise<Color[]> {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to retrieve 2d context from canvas');
  }

  try {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height, { colorSpace: 'srgb' });
    return fromImageData(imageData);
  } catch (e) {
    console.warn('Failed to get ImageData from an image', e);
    throw new Error('Failed to get ImageData from an image');
  }
}

export function fromImageData(imageData: ImageData): Promise<Color[]> {
  const generator = new PaletteGenerator();
  return timed('palette', () => generator.generate(imageData, 10));
}
