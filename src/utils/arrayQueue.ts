import { Queue } from './queue';

/**
 * The array based Queue implementation.
 *
 * @param E The type of elements.
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
   * Whether this queue is empty.
   */
  get isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * The size of this queue.
   */
  get size(): number {
    return this.elements.length;
  }

  /**
   * {@inheritDoc Queue.enqueue}
   */
  enqueue(element: E): boolean {
    this.elements.push(element);
    return true;
  }

  /**
   * {@inheritDoc Queue.dequeue}
   */
  dequeue(): E | undefined {
    return this.elements.shift();
  }

  /**
   * {@inheritDoc Queue.peek}
   */
  peek(): E | undefined {
    return this.elements.at(0);
  }

  /**
   * {@inheritDoc Queue.toArray}
   */
  toArray(): E[] {
    return [...this.elements];
  }
}
