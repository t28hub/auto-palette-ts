/**
 * Ensure 2d context from the given canvas element.
 *
 * @param canvasElement The source canvas element.
 * @return The 2d rendering context.
 * @throws {Error} if the 2d context is not supported.
 */
export function ensureContext2D(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvasElement.getContext('2d');
  if (!context) {
    throw new Error('Failed to ensure 2d context');
  }
  return context;
}

/**
 * Resize the given canvas element to the given size.
 *
 * @param canvasElement The source canvas element.
 * @param size The size for resizing.
 * @return The resized canvas element.
 * @throws {TypeError} if the given size is not positive integer.
 * @throws {Error} if the size of the given canvas is 0.
 */
export function resizeCanvasElement(canvasElement: HTMLCanvasElement, size: number): HTMLCanvasElement {
  if (!Number.isInteger(size) || size <= 0) {
    throw new TypeError(`The area(${size}) is not positive integer`);
  }

  const { width, height } = canvasElement;
  const sourceSize = width * height;
  if (sourceSize === 0) {
    throw new Error(`Either the width(${width}) or height(${height}) of the given canvas is 0`);
  }

  const scale = Math.sqrt(size / sourceSize);
  const resizedWidth = Math.floor(width * scale);
  const resizedHeight = Math.floor(height * scale);

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = resizedWidth;
  resizedCanvas.height = resizedHeight;
  ensureContext2D(resizedCanvas).drawImage(canvasElement, 0, 0, resizedWidth, resizedHeight);
  return resizedCanvas;
}
