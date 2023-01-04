import { ErrorResponseMessage, Request, ResponseMessage } from '../types';

import { extract } from './extract';

/**
 * Declare the property of the {@link WorkerGlobalScope} for TypeScript
 *
 * @see [WorkerGlobalScope.self](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self)
 */
declare const self: DedicatedWorkerGlobalScope;

self.addEventListener('message', (event: MessageEvent<Request>) => {
  const { type, payload } = event.data;
  switch (type) {
    case 'request': {
      try {
        const results = extract(
          payload.imageObject,
          payload.method,
          payload.maxColors,
        );
        const message: ResponseMessage = {
          type: 'response',
          payload: { id: payload.id, results },
        };
        self.postMessage(message);
      } catch (e) {
        const message: ErrorResponseMessage = {
          type: 'error',
          payload: {
            id: payload.id,
            message: `Failed to extract colors: ${e}`,
          },
        };
        self.postMessage(message);
      }
      break;
    }
    default: {
      const message: ErrorResponseMessage = {
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
