import { ensureContext2D, resizeCanvasElement } from './utils';

/**
 * The image class.
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

export class CanvasElementImage implements Image {
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = ensureContext2D(canvas);
  }

  get height(): number {
    return this.canvas.height;
  }

  get width(): number {
    return this.canvas.width;
  }

  async getImageData(): Promise<ImageData> {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height, { colorSpace: 'srgb' });
  }

  async resize(size: number): Promise<Image> {
    const resizedCanvas = resizeCanvasElement(this.canvas, size);
    return new CanvasElementImage(resizedCanvas);
  }
}

export class ImageElementImage implements Image {
  constructor(private readonly imageElement: HTMLImageElement) {}

  get isLoaded(): boolean {
    return this.imageElement.complete;
  }

  get height(): number {
    return this.imageElement.naturalHeight;
  }

  get width(): number {
    return this.imageElement.naturalWidth;
  }

  async getImageData(): Promise<ImageData> {
    const canvas = await this.loadCanvasElement();
    return ensureContext2D(canvas).getImageData(0, 0, canvas.width, canvas.height);
  }

  async resize(size: number): Promise<Image> {
    const canvas = await this.loadCanvasElement();
    const resizedCanvas = resizeCanvasElement(canvas, size);
    return new CanvasElementImage(resizedCanvas);
  }

  private loadCanvasElement(): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      if (this.imageElement.complete) {
        resolve(this.drawImageElement());
        return;
      }

      this.imageElement.addEventListener('load', () => {
        resolve(this.drawImageElement());
      });

      this.imageElement.addEventListener('error', () => {
        reject(new Error(`Failed to load image from ${this.imageElement.src}`));
      });
    });
  }

  private drawImageElement(): HTMLCanvasElement {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = this.imageElement.naturalWidth;
    canvasElement.height = this.imageElement.naturalHeight;
    ensureContext2D(canvasElement).drawImage(this.imageElement, 0, 0);
    return canvasElement;
  }
}
