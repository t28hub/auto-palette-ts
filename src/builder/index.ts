import { color } from '../color';
import { Image } from '../image';
import { Palette } from '../palette';
import { Method, Builder, ImageObject, Options, Swatch } from '../types';
import { id, ID } from '../utils';

import { ExtractionResult, RequestMessage, Response } from './types';
import { defaultWorker } from './worker';

const defaults: Options = {
  method: 'kmeans',
  maxColors: 5,
  maxImageSize: 128 * 128,
} as const;

/**
 * Asynchronous palette builder.
 */
export class PaletteBuilder implements Builder {
  private readonly id: ID;

  /**
   * Create a new PaletteWorker.
   *
   * @param image The image object.
   * @param worker The worker instance.
   */
  constructor(private readonly image: Image, private readonly worker: Worker = defaultWorker()) {
    this.id = id();
  }

  /**
   * Generate a palette from the image data.
   *
   * @return {Promise<Palette>}
   */
  async build(options: Partial<Options> = {}): Promise<Palette> {
    const merged = { ...defaults, ...options };
    const resized = await this.image.resize(merged.maxImageSize);
    const imageData = await resized.getImageData();
    return await this.execute(imageData, merged);
  }

  private execute(imageData: ImageObject<Uint8ClampedArray>, options: Options): Promise<Palette> {
    return new Promise((resolve, reject) => {
      const message = this.buildRequestMessage(imageData, options.method, options.maxColors);
      this.worker.addEventListener('message', (event: MessageEvent<Response>) => {
        if (event.data.payload.id !== this.id) {
          return;
        }

        try {
          const swatches = this.onMessage(event).map((result: ExtractionResult): Swatch => {
            const scaleX = this.image.width / imageData.width;
            const scaleY = this.image.height / imageData.height;
            return {
              color: color(result.color),
              population: result.population,
              coordinate: {
                x: Math.round(result.coordinate.x * scaleX),
                y: Math.round(result.coordinate.x * scaleY),
              },
            };
          });
          resolve(new Palette(swatches));
        } catch (e) {
          reject(e);
        }
      });

      this.worker.addEventListener('error', (event: ErrorEvent) => {
        reject(new Error(event.message));
      });

      this.worker.postMessage(message, [message.payload.imageObject.data]);
    });
  }

  private onMessage(event: MessageEvent<Response>): ExtractionResult[] {
    const { type, payload } = event.data;
    switch (type) {
      case 'response': {
        return payload.results;
      }
      case 'error': {
        const message = payload.message;
        throw new Error(message);
      }
      default: {
        throw new Error(`Unrecognized type of data is received: ${event}`);
      }
    }
  }

  private buildRequestMessage(
    imageData: ImageObject<Uint8ClampedArray>,
    method: Method,
    maxColors: number,
  ): RequestMessage {
    const { height, width, data } = imageData;
    const imageObject: ImageObject<ArrayBuffer> = {
      height,
      width,
      data: data.buffer,
    };

    return {
      type: 'request',
      payload: {
        id: this.id,
        imageObject,
        method,
        maxColors,
      },
    };
  }
}
