import { assertDefined } from './utils';
import { isBrowser, isWebWorker } from './utils/browser';

/**
 * Image source represents the source of a supported image.
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData;

/**
 * Check if the given value is a canvas element.
 *
 * @param value - The value to check.
 * @return True if the value is a canvas element, false otherwise.
 */
export function isCanvasElement(value: ImageSource): value is HTMLCanvasElement {
  return isBrowser() && !isWebWorker() && value instanceof HTMLCanvasElement;
}

/**
 * Check if the given value is an image element.
 *
 * @param value - The value to check.
 * @return True if the value is an image element, false otherwise.
 */
export function isImageElement(value: ImageSource): value is HTMLImageElement {
  return isBrowser() && !isWebWorker() && value instanceof HTMLImageElement;
}

/**
 * Check if the given value is an ImageData object.
 *
 * @param value - The value to check.
 * @return True if the value is an ImageData object, false otherwise.
 */
export function isImageData(value: ImageSource): value is ImageData {
  // Check required properties of ImageData
  return 'data' in value && 'width' in value && 'height' in value;
}

/**
 * Create an ImageData object from the given source.
 *
 * @param source - The source of the image.
 * @return The ImageData object.
 * @throws {TypeError} If the source is not supported.
 */
export function createImageData(source: ImageSource): ImageData {
  if (isCanvasElement(source)) {
    return fromCanvasElement(source);
  }
  if (isImageElement(source)) {
    return fromImageElement(source);
  }
  if (isImageData(source)) {
    return source;
  }
  throw new TypeError('The source of the image is not supported');
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
  context.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
  return context.getImageData(0, 0, canvasElement.width, canvasElement.height);
}
