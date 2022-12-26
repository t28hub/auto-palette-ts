export function ensureContext2D(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvasElement.getContext('2d');
  if (!context) {
    throw new Error('Failed to ensure 2d context');
  }
  return context;
}

export function resizeCanvasElement(canvasElement: HTMLCanvasElement, size: number): HTMLCanvasElement {
  if (!Number.isInteger(size) || size <= 0) {
    throw new TypeError(`The area(${size}) is not positive integer`);
  }

  const { width, height } = canvasElement;
  const imageSize = width * height;
  if (imageSize === 0) {
    throw new Error(`Failed to resize image since either width(${width}) or height(${height}) is 0`);
  }

  const scale = Math.sqrt(size / imageSize);
  const resizedWidth = Math.floor(width * scale);
  const resizedHeight = Math.floor(height * scale);

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = resizedWidth;
  resizedCanvas.height = resizedHeight;
  ensureContext2D(resizedCanvas).drawImage(canvasElement, 0, 0, resizedWidth, resizedHeight);
  return resizedCanvas;
}
