import { CanvasElementImage, Image, ImageElementImage } from './image';
import { ensureContext2D } from './utils';

export { type Image } from './image';

export function fromCanvasElement(canvasElement: HTMLCanvasElement): Image {
  return new CanvasElementImage(canvasElement);
}

export function fromImageElement(imageElement: HTMLImageElement): Image {
  return new ImageElementImage(imageElement);
}

export function fromImageData(imageData: ImageData): Image {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ensureContext2D(canvas).putImageData(imageData, 0, 0);
  return new CanvasElementImage(canvas);
}
