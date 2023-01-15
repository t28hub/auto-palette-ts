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
   * Enqueue the elements to this queue.
   *
   * @param elements The elements to be enqueued.
   * @return true if the elements are enqueued.
   */
  enqueue(...elements: E[]): boolean;

  /**
   * Dequeue an element from this queue.
   *
   * @return The first element or undefined.
   */
  dequeue(): E | undefined;

  /**
   * Return an array of all elements.
   *
   * @return The array of all elements.
   */
  toArray(): E[];
}
