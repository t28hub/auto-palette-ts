import { extract } from './extract';
import { ErrorResponseMessage, Request, ResponseMessage } from './types';

/**
 * Declare the property of the {@link WorkerGlobalScope} for TypeScript
 *
 * @see [WorkerGlobalScope.self](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self)
 */
declare const self: DedicatedWorkerGlobalScope;

self.addEventListener('message', (event: MessageEvent<Request>) => {
  const { id, type, content } = event.data;
  switch (type) {
    case 'request': {
      try {
        const imageData: ImageData = {
          colorSpace: 'srgb',
          height: content.height,
          width: content.width,
          data: new Uint8ClampedArray(content.buffer),
        };
        const points = extract(imageData, content.quality);
        const message: ResponseMessage = {
          id,
          type: 'response',
          content: { points },
        };
        self.postMessage(message);
      } catch (e) {
        const message: ErrorResponseMessage = {
          id,
          type: 'error',
          content: {
            message: `Failed to extract colors: ${e}`,
          },
        };
        self.postMessage(message);
      }
      break;
    }
    default: {
      const message: ErrorResponseMessage = {
        id,
        type: 'error',
        content: {
          message: `Unrecognized event type: ${type}`,
        },
      };
      self.postMessage(message);
      break;
    }
  }
});
