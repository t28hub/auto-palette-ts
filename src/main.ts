import { Extractor } from './extractor';

export function fromImage(image: HTMLImageElement): string[] {
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

export function fromCanvas(canvas: HTMLCanvasElement): string[] {
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

export function fromImageData(imageData: ImageData): string[] {
  const extractor = new Extractor();
  return extractor.extract(imageData);
}