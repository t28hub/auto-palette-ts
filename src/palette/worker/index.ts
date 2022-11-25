import { PackedColor } from '../../color';
import { Result } from '../../extractor/extractor';
import { KmeansExtractor } from '../../extractor/kmeans';
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
      const colors = extractor
        .extract(imageData, maxColors)
        .sort((result1: Result, result2: Result): number => {
          return result2.population - result1.population;
        })
        .map((result: Result): PackedColor => {
          return result.color.toPackedColor();
        });

      const event: CompleteMessage = {
        type: 'complete',
        payload: {
          id: payload.id,
          result: colors,
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
