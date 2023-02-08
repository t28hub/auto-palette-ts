import { parse } from './color';
import { createImage } from './image';
import { Palette } from './palette';
import { Quality, ImageObject, Swatch, ImageSource } from './types';
import { uuid, UUID } from './utils';
import { ExtractionResult, RequestMessage, Response } from './worker';

/**
 * Asynchronous automatic palette extractor.
 */
export class PaletteExtractor {
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
    const requestId = uuid();
    return new Promise((resolve, reject) => {
      const request = PaletteExtractor.buildRequest(requestId, imageData, quality);
      this.worker.addEventListener('message', (event: MessageEvent<Response>) => {
        if (event.data.payload.id !== requestId) {
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

      this.worker.postMessage(request, [request.payload.imageObject.data]);
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

  private static buildRequest(
    requestId: UUID,
    imageData: ImageObject<Uint8ClampedArray>,
    quality: Quality,
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
        id: requestId,
        imageObject,
        quality,
      },
    };
  }
}
