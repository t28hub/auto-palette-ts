import { RejectionFunction, ResolutionFunction } from '../types';
import { UUID } from '../utils';

import { RequestMessage, Response, ResponseMessage } from './types';

/**
 * Promise-based worker class.
 */
export class WorkerPromise {
  private readonly callbacks: Map<UUID, [ResolutionFunction<ResponseMessage>, RejectionFunction]>;

  /**
   * Create a new WorkerPromise.
   *
   * @param worker The worker to be promisify.
   */
  constructor(private readonly worker: Worker) {
    this.callbacks = new Map();
    this.worker.onmessage = this.onMessage.bind(this);
  }

  /**
   * Post the given message to worker.
   *
   * @param message The message to post to the worker.
   * @param transfer The transferable objects to transfer ownership.
   * @return Promise<ResponseMessage>
   */
  postMessage(message: RequestMessage, transfer: Transferable[] = []): Promise<ResponseMessage> {
    return new Promise((resolve: ResolutionFunction<ResponseMessage>, reject: RejectionFunction) => {
      this.callbacks.set(message.id, [resolve, reject]);
      this.worker.postMessage(message, transfer);
    });
  }

  /**
   * Terminate this worker.
   */
  terminate() {
    this.worker.terminate();
  }

  private onMessage(event: MessageEvent<Response>) {
    const { id, type } = event.data;
    const callback = this.callbacks.get(id);
    if (!callback) {
      return;
    }

    const [resolve, reject] = callback;
    switch (type) {
      case 'response':
        resolve(event.data);
        break;
      case 'error':
        reject(new Error(event.data.content.message));
        break;
      default:
        reject(new Error(`Received unrecognized message type: ${type}`));
        break;
    }
    this.callbacks.delete(id);
  }
}
