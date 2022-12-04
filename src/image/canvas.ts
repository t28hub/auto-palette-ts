import { Image } from './image';

export class CanvasImage implements Image {
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = CanvasImage.ensureContext2D(canvas);
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  getImageData(): ImageData {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height, { colorSpace: 'srgb' });
  }

  resize(size: number): Image {
    if (!Number.isInteger(size) || size <= 0) {
      throw new TypeError(`The area(${size}) is not positive integer`);
    }

    const imageSize = this.width * this.height;
    const scale = Math.sqrt(size / imageSize);
    const resizedWidth = Math.floor(this.width * scale);
    const resizedHeight = Math.floor(this.height * scale);

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = resizedWidth;
    resizedCanvas.height = resizedHeight;
    CanvasImage.ensureContext2D(resizedCanvas).drawImage(this.canvas, 0, 0, resizedWidth, resizedHeight);
    return new CanvasImage(resizedCanvas);
  }

  static fromImageElement(image: HTMLImageElement): Image {
    if (!image.complete) {
      throw new TypeError(`Image(src=${image.src}) is not loaded`);
    }

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    this.ensureContext2D(canvas).drawImage(image, 0, 0);
    return new CanvasImage(canvas);
  }

  private static ensureContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to ensure 2d context');
    }
    return context;
  }
}
