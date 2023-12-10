import { assertDefined } from './utils';

/**
 * Image source represents the source of a supported image.
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData;

/**
 * Create an ImageData object from the given source.
 *
 * @param source - The source of the image.
 * @return The ImageData object.
 */
export function createImageData(source: ImageSource): ImageData {
  if (source instanceof HTMLCanvasElement) {
    return fromCanvasElement(source);
  }
  if (source instanceof HTMLImageElement) {
    return fromImageElement(source);
  }
  return new ImageData(source.data, source.width, source.height);
}

/**
 * Ensure a 2D context from the given canvas element.
 *
 * @param canvas - The source canvas element.
 * @return The 2D rendering context.
 * @throws {Error} if the 2D context is not supported in the current environment.
 */
function ensureContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  assertDefined(context, 'The 2D context might not supported in this environment');
  return context;
}

/**
 * Create an ImageData object from the given canvas element.
 *
 * @param canvas - The source canvas element.
 * @return The ImageData object.
 */
function fromCanvasElement(canvas: HTMLCanvasElement): ImageData {
  const context = ensureContext2D(canvas);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Create an ImageData object from the given image element.
 *
 * @param image - The source image element.
 * @return The ImageData object.
 * @throws {Error} If the image element is not loaded.
 */
function fromImageElement(image: HTMLImageElement): ImageData {
  if (!image.complete) {
    throw new Error(`The image element is not loaded: ${image.src}`);
  }

  const canvasElement = document.createElement('canvas');
  canvasElement.width = image.width;
  canvasElement.height = image.height;
  const context = ensureContext2D(canvasElement);
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, canvasElement.width, canvasElement.height);
}
