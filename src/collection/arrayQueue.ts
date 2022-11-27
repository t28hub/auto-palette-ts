import { Queue } from './queue';

/**
 * The array based Queue implementation.
 */
export class ArrayQueue<E> implements Queue<E> {
  private readonly elements: E[];

  /**
   * Create a new ArrayQueue.
   *
   * @param elements The initial elements to be enqueued.
   */
  public constructor(...elements: E[]) {
    this.elements = [...elements];
  }

  /**
   * The size of this queue.
   */
  get size(): number {
    return this.elements.length;
  }

  /**
   * Whether this queue is empty.
   */
  get isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * Enqueue the elements to this queue.
   *
   * @param elements The elements to be enqueued.
   * @return true if the elements are enqueued.
   */
  enqueue(...elements: E[]): boolean {
    this.elements.push(...elements);
    return true;
  }

  /**
   * Dequeue the element from this queue.
   *
   * @return The first element or undefined.
   */
  dequeue(): E | undefined {
    return this.elements.shift();
  }
}
