import { PaletteBuilder } from './builder';
import { fromCanvasElement, fromImageData, fromImageElement, Image } from './image';
import { Builder, ImageSource } from './types';

/**
 * Create a new builder from the given image source.
 *
 * @param source The image source.
 * @return The new palette builder.
 */
export function palette(source: ImageSource): Builder {
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
