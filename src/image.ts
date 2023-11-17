/**
 * Type representing a source of image.
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData;

/**
 * Create an image data from the given source.
 *
 * @param source The source of image.
 * @return The image data.
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
 * Ensure 2d context from the given canvas element.
 *
 * @param canvas The source canvas element.
 * @return The 2d rendering context.
 * @throws {Error} if the 2d context is not supported.
 */
function ensureContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to ensure 2d context');
  }
  return context;
}

function fromCanvasElement(element: HTMLCanvasElement): ImageData {
  const context = ensureContext2D(element);
  return context.getImageData(0, 0, element.width, element.height);
}

function fromImageElement(element: HTMLImageElement): ImageData {
  if (!element.complete) {
    throw new Error(`Image element has not loaded: ${element.src}`);
  }

  const canvasElement = document.createElement('canvas');
  canvasElement.width = element.width;
  canvasElement.height = element.height;
  const context = ensureContext2D(canvasElement);
  context.drawImage(element, 0, 0);
  return context.getImageData(0, 0, canvasElement.width, canvasElement.height);
}
