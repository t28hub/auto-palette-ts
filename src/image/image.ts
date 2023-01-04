import { ensureContext2D, resizeCanvas } from './utils';

/**
 * The image interface.
 */
export interface Image {
  /**
   * The width of this image.
   */
  readonly width: number;

  /**
   * The height of this image.
   */
  readonly height: number;

  /**
   * Return the image data of this image
   *
   * @return The image data of this image.
   */
  getImageData(): Promise<ImageData>;

  /**
   * Resize this image.
   *
   * @param size The size of resized image.
   * @return The resized image.
   */
  resize(size: number): Promise<Image>;
}

/**
 * Canvas element based image class.
 */
export class CanvasElementImage implements Image {
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = ensureContext2D(canvas);
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  async getImageData(): Promise<ImageData> {
    return this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      { colorSpace: 'srgb' },
    );
  }

  async resize(size: number): Promise<Image> {
    const resizedCanvas = resizeCanvas(this.canvas, size);
    return new CanvasElementImage(resizedCanvas);
  }
}

/**
 * Image element based image class.
 */
export class ImageElementImage implements Image {
  constructor(private readonly image: HTMLImageElement) {}

  get isLoaded(): boolean {
    return this.image.complete;
  }

  get width(): number {
    return this.image.naturalWidth;
  }

  get height(): number {
    return this.image.naturalHeight;
  }
  async getImageData(): Promise<ImageData> {
    const canvas = await this.loadCanvasElement();
    return ensureContext2D(canvas).getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }

  async resize(size: number): Promise<Image> {
    const canvas = await this.loadCanvasElement();
    const resizedCanvas = resizeCanvas(canvas, size);
    return new CanvasElementImage(resizedCanvas);
  }

  private loadCanvasElement(): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      if (this.image.complete) {
        resolve(this.drawImageElement());
        return;
      }

      this.image.addEventListener('load', () => {
        resolve(this.drawImageElement());
      });

      this.image.addEventListener('error', () => {
        reject(new Error(`Failed to load image from ${this.image.src}`));
      });
    });
  }

  private drawImageElement(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.image.naturalWidth;
    canvas.height = this.image.naturalHeight;
    ensureContext2D(canvas).drawImage(this.image, 0, 0);
    return canvas;
  }
}
