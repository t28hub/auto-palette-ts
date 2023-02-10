import '@vitest/web-worker';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { uuid } from '../utils';

import { RequestMessage, Response } from './types';
import Worker from './worker?worker&inline';
import { WorkerPromise } from './workerPromise';

function isResponse(value: unknown): value is Response {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('id' in value) || typeof value.id !== 'string') {
    return false;
  }

  if (!('type' in value) || typeof value.type !== 'string') {
    return false;
  }
  return value.type === 'response' || value.type === 'error';
}

describe('WorkerPromise', () => {
  let workerPromise: WorkerPromise;
  beforeEach(() => {
    const worker = new Worker();
    workerPromise = new WorkerPromise(worker);
  });

  afterEach(async () => {
    workerPromise.terminate();
    vi.unmock('./extract');
  });

  it('should return response if the Promise is resolved', () => {
    // Arrange
    const message: RequestMessage = {
      id: uuid(),
      type: 'request',
      content: {
        width: 2,
        height: 2,
        buffer: new ArrayBuffer(2 * 2 * 4),
        quality: 'high',
      },
    };

    // Act
    const actual = workerPromise.postMessage(message, [message.content.buffer]);

    // Assert
    expect(actual).resolves.toSatisfy((value: unknown) => {
      if (!isResponse(value)) {
        return false;
      }
      return value.id === message.id;
    });
  });

  it('should respond with requested ID', () => {
    // Arrange
    const message1: RequestMessage = {
      id: uuid(),
      type: 'request',
      content: {
        width: 4,
        height: 4,
        buffer: new ArrayBuffer(4 * 4 * 4),
        quality: 'low',
      },
    };
    const message2: RequestMessage = {
      id: uuid(),
      type: 'request',
      content: {
        width: 2,
        height: 2,
        buffer: new ArrayBuffer(2 * 2 * 4),
        quality: 'high',
      },
    };

    // Act
    const actual1 = workerPromise.postMessage(message1, [message1.content.buffer]);
    const actual2 = workerPromise.postMessage(message2, [message2.content.buffer]);

    // Assert
    expect(actual1).resolves.toSatisfy((value: unknown) => {
      if (!isResponse(value)) {
        return false;
      }
      return value.id === message1.id;
    });
    expect(actual2).resolves.toSatisfy((value: unknown) => {
      if (!isResponse(value)) {
        return false;
      }
      return value.id === message2.id;
    });
  });

  it('should throw Error if the Promise is rejected', () => {
    // Arrange
    vi.mock('./extract', () => ({
      extract: vi.fn(() => {
        throw new Error('Unknown error');
      }),
    }));

    const message: RequestMessage = {
      id: uuid(),
      type: 'request',
      content: {
        width: 2,
        height: 2,
        buffer: new ArrayBuffer(2 * 2 * 4),
        quality: 'high',
      },
    };

    // Act
    const actual = workerPromise.postMessage(message, [message.content.buffer]);

    // Assert
    expect(actual).rejects.toThrowError(Error);
  });
});
