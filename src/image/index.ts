import { CanvasImage } from './canvas';
import { Image } from './image';

export { type Image } from './image';

/**
 * Load a image from the given source.
 *
 * @param source The image source.
 * @return The loaded image.
 */
export function load(source: HTMLImageElement): Image {
  return CanvasImage.fromImageElement(source);
}
