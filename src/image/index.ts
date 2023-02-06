import { ImageSource } from '../types';

import { CanvasElementImage, Image, ImageElementImage } from './image';
import { ensureContext2D } from './utils';

export { type Image } from './image';

/**
 * Create an image from the given Canvas element.
 *
 * @param canvasElement The source canvas element.
 * @return The created image.
 */
export function fromCanvasElement(canvasElement: HTMLCanvasElement): Image {
  return new CanvasElementImage(canvasElement);
}

/**
 * Create an image from the given Image element.
 *
 * @param imageElement The source canvas element.
 * @return The created image.
 */
export function fromImageElement(imageElement: HTMLImageElement): Image {
  return new ImageElementImage(imageElement);
}

/**
 * Create an image from the given ImageData.
 *
 * @param imageData The source image data.
 * @return The created image.
 */
export function fromImageData(imageData: ImageData): Image {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ensureContext2D(canvas).putImageData(imageData, 0, 0);
  return new CanvasElementImage(canvas);
}

/**
 * Create an image from the given image source.
 *
 * @param source The source of image.
 * @return The created image.
 */
export function createImage(source: ImageSource): Image {
  if (source instanceof HTMLCanvasElement) {
    return fromCanvasElement(source);
  }
  if (source instanceof HTMLImageElement) {
    return fromImageElement(source);
  }
  return fromImageData(source);
}
