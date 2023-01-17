/**
 * Interface representing queue.
 *
 * @param E The type of elements.
 */
export interface Queue<E> {
  /**
   * Whether this queue is empty.
   */
  readonly isEmpty: boolean;

  /**
   * The size of this queue.
   */
  readonly size: number;

  /**
   * Enqueue the given element to this queue.
   *
   * @param element The element to be enqueued.
   * @return true if the element is enqueued.
   */
  enqueue(element: E): boolean;

  /**
   * Dequeue an element from this queue.
   *
   * @return The head element, or undefined if this queue is empty.
   * @see peek
   */
  dequeue(): E | undefined;

  /**
   * Return the head element of this queue, but does not remove.
   *
   * @return The head element, or undefined if this queue is empty.
   * @see dequeue
   */
  peek(): E | undefined;

  /**
   * Return an array of all elements.
   *
   * @return The array of all elements.
   */
  toArray(): E[];
}
