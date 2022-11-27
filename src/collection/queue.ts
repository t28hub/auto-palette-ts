/**
 * Interface representing Queue.
 */
export interface Queue<E> {
  /**
   * The size of this queue.
   */
  readonly size: number;

  /**
   * Whether this queue is empty.
   */
  readonly isEmpty: boolean;

  /**
   * Enqueue the elements to this queue.
   *
   * @param elements The elements to be enqueued.
   * @return true if the elements are enqueued.
   */
  enqueue(...elements: E[]): boolean;

  /**
   * Dequeue the element from this queue.
   *
   * @return The first element or undefined.
   */
  dequeue(): E | undefined;
}
