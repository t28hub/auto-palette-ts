import { Color, PackedColor } from '../color';
import { ExtractionResult } from '../extractor';
import { id, ID } from '../utils';

import { ExtractMessage, Message } from './message';
import { Palette } from './palette';
import Worker from './worker?worker&inline';

const defaultWorker = new Worker();

/**
 * Asynchronous palette generator.
 */
export class PaletteGenerator {
  private readonly id: ID;

  /**
   * Create a new PaletteWorker.
   *
   * @param worker The worker instance.
   */
  constructor(private readonly worker: Worker = defaultWorker) {
    this.id = id();
  }

  /**
   * Generate a palette from the image data.
   *
   * @param imageData The image data.
   * @param maxColors The max colors.
   * @return {Promise<Palette>}
   */
  generate(imageData: ImageData, maxColors: number): Promise<Palette> {
    return new Promise((resolve, reject) => {
      const message = this.buildMessage(imageData, maxColors);
      this.worker.postMessage(message, [message.payload.image.pixels]);

      this.worker.addEventListener('message', (event: MessageEvent<Message>) => {
        const { type, payload } = event.data;
        if (payload.id !== this.id) {
          return;
        }

        switch (type) {
          case 'complete': {
            const colors = payload.results.map((result: ExtractionResult<PackedColor>): ExtractionResult<Color> => {
              return {
                color: Color.fromPackedColor(result.color),
                population: result.population,
              };
            });
            resolve(new Palette(colors));
            break;
          }
          case 'error': {
            const message = payload.message;
            reject(new Error(message));
            break;
          }
        }
      });

      this.worker.addEventListener('error', (event: ErrorEvent) => {
        reject(new Error(event.message));
      });
    });
  }

  private buildMessage(imageData: ImageData, maxColors: number): ExtractMessage {
    const image = {
      width: imageData.width,
      height: imageData.height,
      pixels: imageData.data.buffer,
    };
    return {
      type: 'extract',
      payload: {
        id: this.id,
        image,
        maxColors,
      },
    };
  }
}
