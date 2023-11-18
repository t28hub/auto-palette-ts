import { Queue } from './queue';

/**
 * Array based queue implementation.
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
   * {@inheritDoc Queue.push}
   */
  push(element: E): void {
    this.elements.push(element);
  }

  /**
   * {@inheritDoc Queue.pop}
   */
  pop(): E | undefined {
    return this.elements.shift();
  }

  /**
   * {@inheritDoc Queue.peek}
   */
  peek(): E | undefined {
    return this.elements[0];
  }

  /**
   * {@inheritDoc Queue.toArray}
   */
  toArray(): E[] {
    return [...this.elements];
  }
}
