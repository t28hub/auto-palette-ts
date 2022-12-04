import { Image } from './image';

/**
 * Image implementation using Canvas.
 */
export class CanvasImage implements Image {
  private readonly context: CanvasRenderingContext2D;

  /**
   * Create a new {@link CanvasImage}.
   *
   * @param canvas The source canvas element.
   * @throws {Error} if context 2D cannot be ensured.
   */
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
    if (imageSize === 0) {
      throw new Error(`Failed to resize image since either width(${this.width}) or height(${this.height}) is 0`);
    }
    const scale = Math.sqrt(size / imageSize);
    const resizedWidth = Math.floor(this.width * scale);
    const resizedHeight = Math.floor(this.height * scale);

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = resizedWidth;
    resizedCanvas.height = resizedHeight;
    CanvasImage.ensureContext2D(resizedCanvas).drawImage(this.canvas, 0, 0, resizedWidth, resizedHeight);
    return new CanvasImage(resizedCanvas);
  }

  static fromImageElement(imageElement: HTMLImageElement): Promise<Image> {
    return new Promise<Image>((resolve, reject) => {
      if (imageElement.complete) {
        const image = CanvasImage.createImage(imageElement);
        resolve(image);
        return;
      }

      imageElement.addEventListener('load', () => {
        const image = CanvasImage.createImage(imageElement);
        resolve(image);
      });
      imageElement.addEventListener('error', () => {
        reject(`Failed to load image from ${imageElement.src}`);
      });
    });
  }

  private static createImage(image: HTMLImageElement): CanvasImage {
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
