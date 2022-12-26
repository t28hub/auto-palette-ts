import { color } from '../color';
import { Algorithm, Color, ImageData, PackedColor, Swatch } from '../types';
import { id, ID } from '../utils';

import { RequestMessage, Response } from './message';
import { Palette } from './palette';
import { defaultWorker } from './worker';

/**
 * Asynchronous palette builder.
 */
export class PaletteBuilder {
  private readonly id: ID;

  /**
   * Create a new PaletteWorker.
   *
   * @param worker The worker instance.
   */
  constructor(private readonly worker: Worker = defaultWorker()) {
    this.id = id();
  }

  /**
   * Generate a palette from the image data.
   *
   * @param imageData The image data.
   * @param algorithm The color extraction algorithm.
   * @param maxColors The max colors.
   * @return {Promise<Palette>}
   */
  build(imageData: ImageData<Uint8ClampedArray>, algorithm: Algorithm, maxColors: number): Promise<Palette> {
    return new Promise((resolve, reject) => {
      const message = this.buildRequest(imageData, algorithm, maxColors);
      this.worker.addEventListener('message', (event: MessageEvent<Response>) => {
        if (event.data.payload.id !== this.id) {
          return;
        }

        try {
          const palette = this.onMessage(event);
          resolve(palette);
        } catch (e) {
          reject(e);
        }
      });

      this.worker.addEventListener('error', (event: ErrorEvent) => {
        reject(new Error(event.message));
      });

      this.worker.postMessage(message, [message.payload.imageData.data]);
    });
  }

  private onMessage(event: MessageEvent<Response>): Palette {
    const { type, payload } = event.data;
    switch (type) {
      case 'response': {
        const colors = payload.results.map((result: Swatch<PackedColor>): Swatch<Color> => {
          return {
            color: color(result.color),
            population: result.population,
          };
        });
        return new Palette(colors);
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

  private buildRequest(
    imageData: ImageData<Uint8ClampedArray>,
    algorithm: Algorithm,
    maxColors: number,
  ): RequestMessage {
    const { height, width, data } = imageData;
    const image: ImageData<ArrayBuffer> = {
      height,
      width,
      data: data.buffer,
    };

    return {
      type: 'request',
      payload: {
        id: this.id,
        imageData: image,
        algorithm,
        maxColors,
      },
    };
  }
}
