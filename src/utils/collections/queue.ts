/**
 * Interface representing a queue data structure.
 *
 * @param E The type of elements in the queue.
 */
export interface Queue<E> {
  /**
   * Whether this queue is empty.
   */
  readonly isEmpty: boolean;

  /**
   * The size of this queue (number of elements).
   */
  readonly size: number;

  /**
   * Push an element to the tail of this queue.
   *
   * @param element The element to push to the queue.
   */
  push(element: E): void;

  /**
   * Pop an element from the head of this queue.
   *
   * @return The element popped from the queue, or undefined if this queue is empty.
   */
  pop(): E | undefined;

  /**
   * Return the head element of the queue without removing it.
   *
   * @return The element at the front of the queue, or undefined if this queue is empty.
   * @see pop
   */
  peek(): E | undefined;

  /**
   * Return all elements of the queue as an array.
   *
   * @return The array containing all elements of the queue.
   */
  toArray(): E[];
}
