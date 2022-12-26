import { fromCanvasElement, fromImageData, fromImageElement, Image } from './image';
import { PaletteBuilder } from './palette/builder';
import { Builder } from './types';

export function from(source: HTMLCanvasElement | HTMLImageElement | ImageData): Builder {
  let image: Image;
  if (source instanceof HTMLCanvasElement) {
    image = fromCanvasElement(source);
  } else if (source instanceof HTMLImageElement) {
    image = fromImageElement(source);
  } else {
    image = fromImageData(source);
  }
  return new PaletteBuilder(image);
}
