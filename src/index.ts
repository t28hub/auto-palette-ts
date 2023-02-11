import { parse } from './color';
import { createImage } from './image';
import { Palette } from './palette';
import { ImageSource, Quality, Swatch } from './types';
import { uuid } from './utils';
import { defaultWorker, FeaturePoint, WorkerPromise } from './worker';

export type { Palette } from './palette';
export type { Color, ImageSource, Quality, Swatch } from './types';

/**
 * Type representing options for Auto Palette.
 */
export type Options = {
  /**
   * The extraction quality.
   */
  readonly quality: Quality;

  /**
   * The max image size.
   */
  readonly maxImageSize: number;
};

const DefaultOptions: Options = {
  quality: 'middle',
  maxImageSize: 128 * 128,
};

/**
 * AutoPalette class for extracting Palette instances.
 */
export class AutoPalette {
  private readonly worker: WorkerPromise;

  /**
   * Create a new AutoPalette.
   *
   * @private
   * @param quality The extraction quality.
   * @param maxImageSize The max image size.
   * @param worker The worker instance.
   */
  private constructor(private readonly quality: Quality, private readonly maxImageSize: number, worker: Worker) {
    this.worker = new WorkerPromise(worker);
  }

  /**
   * Extract the palette from image source.
   *
   * @param source The image source.
   * @return The promise-based extracted palette.
   */
  async extract(source: ImageSource): Promise<Palette> {
    const image = createImage(source);
    const resized = await image.resize(this.maxImageSize);
    const imageData = await resized.getImageData();
    const features = await this.extractFeatures(imageData);

    const scaleX = image.width / resized.width;
    const scaleY = image.height / resized.height;
    const swatches = features.map((point: FeaturePoint): Swatch => {
      return {
        color: parse(point.color),
        population: point.population,
        coordinate: {
          x: Math.round(point.coordinate.x * scaleX),
          y: Math.round(point.coordinate.y * scaleY),
        },
      };
    });
    return new Palette(swatches);
  }

  private async extractFeatures(imageData: ImageData): Promise<FeaturePoint[]> {
    const response = await this.worker.postMessage({
      id: uuid(),
      type: 'request',
      content: {
        width: imageData.width,
        height: imageData.height,
        buffer: imageData.data.buffer,
        quality: this.quality,
      },
    });
    return response.content.points;
  }

  /**
   * Create a new AutoPalette from options.
   *
   * @param options The options for AutoPalette.
   * @return The new AutoPalette.
   */
  static create(options: Partial<Options> = {}): AutoPalette {
    const { quality, maxImageSize } = { ...DefaultOptions, ...options };
    return new AutoPalette(quality, maxImageSize, defaultWorker());
  }
}
