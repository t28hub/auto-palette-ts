import { parse } from './color';
import { createImage } from './image';
import { Palette } from './palette';
import { Quality, ImageObject, Swatch, ImageSource } from './types';
import { id, ID } from './utils';
import { ExtractionResult, RequestMessage, Response } from './worker';

/**
 * Asynchronous automatic palette extractor.
 */
export class PaletteExtractor {
  private readonly id: ID;

  /**
   * Create a new AutoPalette.
   *
   * @private
   * @param quality The palette extraction quality.
   * @param maxImageSize The maximum image size.
   * @param worker The worker instance.
   * @throws {TypeError} if the maxImageSize is invalid.
   */
  constructor(
    private readonly quality: Quality,
    private readonly maxImageSize: number,
    private readonly worker: Worker,
  ) {
    if (maxImageSize < 1) {
      throw new TypeError(`The maximum image size is invalid: ${maxImageSize}`);
    }
    this.id = id();
  }

  /**
   * Extract a palette from the image data.
   *
   * @param source The image source for palette extraction.
   * @return {Promise<Palette>}
   */
  async extract(source: ImageSource): Promise<Palette> {
    const image = createImage(source);
    const resized = await image.resize(this.maxImageSize);
    const imageData = await resized.getImageData();
    const scale = image.width / resized.width;
    return await this.execute(imageData, scale, this.quality);
  }

  private execute(imageData: ImageData, scale: number, quality: Quality): Promise<Palette> {
    return new Promise((resolve, reject) => {
      const message = this.buildRequestMessage(imageData, quality);
      this.worker.addEventListener('message', (event: MessageEvent<Response>) => {
        if (event.data.payload.id !== this.id) {
          return;
        }

        try {
          const swatches = this.onMessage(event).map((result): Swatch => {
            return {
              color: parse(result.color),
              population: result.population,
              coordinate: {
                x: Math.round(result.coordinate.x * scale),
                y: Math.round(result.coordinate.y * scale),
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

  private buildRequestMessage(imageData: ImageObject<Uint8ClampedArray>, quality: Quality): RequestMessage {
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
        quality,
      },
    };
  }
}
