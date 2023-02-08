import '@vitest/web-worker';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { uuid } from '../utils';

import { ErrorResponseMessage, RequestMessage, ResponseMessage } from './types';
import Worker from './worker?worker&inline';

function isResponseMessage(value: unknown): value is ResponseMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('type' in value) || !('payload' in value)) {
    return false;
  }

  const type = value.type;
  if (type !== 'response') {
    return false;
  }

  const payload = value.payload;
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }
  if (!('id' in payload) || !('results' in payload)) {
    return false;
  }
  return typeof payload.id === 'string' && Array.isArray(payload.results);
}

function isErrorResponseMessage(value: unknown): value is ErrorResponseMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('type' in value) || !('payload' in value)) {
    return false;
  }

  const type = value.type;
  if (type !== 'error') {
    return false;
  }

  const payload = value.payload;
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }
  if (!('id' in payload) || !('message' in payload)) {
    return false;
  }
  return typeof payload.id === 'string' && typeof payload.message === 'string';
}

describe('worker', () => {
  let worker: Worker;
  let workerPromise: Promise<MessageEvent>;
  beforeEach(() => {
    worker = new Worker();
    workerPromise = new Promise((resolve, reject) => {
      worker.addEventListener('message', (event) => {
        resolve(event);
      });
      worker.addEventListener('messageerror', (event) => {
        reject(event);
      });
      worker.addEventListener('error', (error) => {
        reject(error);
      });
    });
  });

  afterEach(() => {
    worker.terminate();
    vi.unmock('./extract');
  });

  it('should send a message with extraction results', async () => {
    // Act
    const message: RequestMessage = {
      type: 'request',
      payload: {
        id: uuid(),
        quality: 'high',
        imageObject: {
          width: 2,
          height: 2,
          data: new ArrayBuffer(16),
        },
      },
    };
    worker.postMessage(message);
    const actual = await workerPromise;

    // Assert
    expect(actual).toSatisfy((event: MessageEvent) => {
      const data = event.data;
      if (!isResponseMessage(data)) {
        return false;
      }
      return data.payload.id === message.payload.id;
    });
  });

  it('should send an error message if extraction is failed', async () => {
    // Arrange
    vi.mock('./extract', () => ({
      extract: vi.fn(() => {
        throw new Error('Unknown error');
      }),
    }));

    // Act
    const message = {
      type: 'request',
      payload: {
        id: uuid(),
        method: 'unknown',
        maxColors: 2,
        imageObject: {
          width: 2,
          height: 2,
          data: new ArrayBuffer(16),
        },
      },
    };
    worker.postMessage(message);
    const actual = await workerPromise;

    // Assert
    expect(actual).toSatisfy((event: MessageEvent) => {
      const data = event.data;
      if (!isErrorResponseMessage(data)) {
        return false;
      }
      return data.payload.id === message.payload.id;
    });
  });

  it('should send an error message if type is unrecognized', async () => {
    // Act
    const message = {
      type: 'unknown',
      payload: { id: uuid() },
    };
    worker.postMessage(message);
    const actual = await workerPromise;

    // Assert
    expect(actual).toSatisfy((event: MessageEvent) => {
      const data = event.data;
      if (!isErrorResponseMessage(data)) {
        return false;
      }
      return data.payload.id === message.payload.id;
    });
  });
});
