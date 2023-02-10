import '@vitest/web-worker';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { uuid } from '../utils';

import { ErrorResponseMessage, Message, RequestMessage, ResponseMessage } from './types';
import Worker from './worker?worker&inline';

function isMessage(value: unknown): value is Message<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('id' in value) || typeof value.id !== 'string') {
    return false;
  }

  return 'type' in value && 'content' in value;
}

function isResponseMessage(value: unknown): value is ResponseMessage {
  if (!isMessage(value)) {
    return false;
  }

  const type = value.type;
  if (type !== 'response') {
    return false;
  }

  const content = value.content;
  if (typeof content !== 'object' || content === null) {
    return false;
  }
  if (!('points' in content)) {
    return false;
  }
  return Array.isArray(content.points);
}

function isErrorResponseMessage(value: unknown): value is ErrorResponseMessage {
  if (!isMessage(value)) {
    return false;
  }

  const type = value.type;
  if (type !== 'error') {
    return false;
  }

  const content = value.content;
  if (typeof content !== 'object' || content === null) {
    return false;
  }
  if (!('message' in content)) {
    return false;
  }
  return typeof content.message === 'string';
}

describe('Worker', () => {
  let worker: Worker;
  let workerPromise: Promise<MessageEvent>;
  beforeEach(() => {
    worker = new Worker();
    workerPromise = new Promise((resolve, reject) => {
      worker.onerror = (error) => reject(error);
      worker.onmessage = (event) => resolve(event);
      worker.onmessageerror = (event) => reject(event);
    });
  });

  afterEach(() => {
    worker.terminate();
    vi.unmock('./extract');
  });

  it('should send a message with extraction results', async () => {
    // Act
    const message: RequestMessage = {
      id: uuid(),
      type: 'request',
      content: {
        width: 2,
        height: 2,
        buffer: new ArrayBuffer(16),
        quality: 'high',
      },
    };
    worker.postMessage(message);
    const actual = await workerPromise;

    // Assert
    expect(actual).toSatisfy((event: MessageEvent) => {
      const data = event.data;
      if (data.id !== message.id) {
        return false;
      }
      return isResponseMessage(data);
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
    const message: RequestMessage = {
      id: uuid(),
      type: 'request',
      content: {
        height: 2,
        width: 2,
        buffer: new ArrayBuffer(16),
        quality: 'middle',
      },
    };
    worker.postMessage(message);
    const actual = await workerPromise;

    // Assert
    expect(actual).toSatisfy((event: MessageEvent) => {
      const data = event.data;
      if (data.id !== message.id) {
        return false;
      }
      return isErrorResponseMessage(data);
    });
  });

  it('should send an error message if type is unrecognized', async () => {
    // Act
    const message = {
      id: uuid(),
      type: 'unknown',
      content: {
        message: 'Unrecognized message type: unknown',
      },
    };
    worker.postMessage(message);
    const actual = await workerPromise;

    // Assert
    expect(actual).toSatisfy((event: MessageEvent) => {
      const data = event.data;
      if (data.id !== message.id) {
        return false;
      }
      return isErrorResponseMessage(data);
    });
  });
});
