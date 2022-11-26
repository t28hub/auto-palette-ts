import { Color, PackedColor } from '../../color';
import { ExtractionResult, KmeansExtractor } from '../../extractor';
import { Kmeans } from '../../kmeans';
import { CompleteMessage, ErrorMessage, Message } from '../message';

/**
 * Declare the property of the {@link WorkerGlobalScope} for TypeScript
 *
 * @see [WorkerGlobalScope.self](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self)
 */
declare const self: DedicatedWorkerGlobalScope;

self.addEventListener('message', (event: MessageEvent<Message>) => {
  const { type, payload } = event.data;
  switch (type) {
    case 'extract': {
      const { image, maxColors } = payload;
      const imageData = new ImageData(image.width, image.height);
      imageData.data.set(new Uint8ClampedArray(image.pixels));

      const extractor = new KmeansExtractor(new Kmeans());
      const results = extractor
        .extract(imageData, maxColors)
        .sort((result1: ExtractionResult<Color>, result2: ExtractionResult<Color>): number => {
          return result2.population - result1.population;
        })
        .map((result: ExtractionResult<Color>): ExtractionResult<PackedColor> => {
          return {
            color: result.color.toPackedColor(),
            population: result.population,
          };
        });

      const event: CompleteMessage = {
        type: 'complete',
        payload: {
          id: payload.id,
          results,
        },
      };
      self.postMessage(event);
      break;
    }
    default: {
      const message: ErrorMessage = {
        type: 'error',
        payload: {
          id: payload.id,
          message: `Unrecognized event type: ${type}`,
        },
      };
      self.postMessage(message);
      break;
    }
  }
});
