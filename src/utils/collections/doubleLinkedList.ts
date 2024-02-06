/**
 * A node in a double linked list.
 */
export interface DoubleLinkedListNode<T> {
  /**
   * The value of the node.
   */
  value: T;

  /**
   * The previous node in the list.
   */
  prev: DoubleLinkedListNode<T> | undefined;

  /**
   * The next node in the list.
   */
  next: DoubleLinkedListNode<T> | undefined;
}

/**
 * Double linked list implementation.
 *
 * @typeParam T - The type of the value in the list.
 */
export class DoubleLinkedList<T> {
  private first: DoubleLinkedListNode<T> | undefined;
  private last: DoubleLinkedListNode<T> | undefined;
  private size: number;

  /**
   * Create a new DoubleLinkedList.
   */
  constructor() {
    this.first = undefined;
    this.last = undefined;
    this.size = 0;
  }

  /**
   * The length of the list.
   *
   * @returns The length of the list.
   */
  get length() {
    return this.size;
  }

  getFirst(): DoubleLinkedListNode<T> | undefined {
    return this.first;
  }

  getLast(): DoubleLinkedListNode<T> | undefined {
    return this.last;
  }

  /**
   * Add a node to the first of the list.
   *
   * @param node - The node to add.
   */
  addFirst(node: DoubleLinkedListNode<T>) {
    if (!this.last) {
      this.last = node;
    } else if (this.first) {
      this.first.prev = node;
      node.next = this.first;
    }
    this.first = node;
    this.size++;
  }

  /**
   * Remove a node from the list.
   *
   * @param node - The node to remove.
   */
  remove(node: DoubleLinkedListNode<T>) {
    if (!node.next) {
      if (!node.prev) {
        if (this.first !== node || this.last !== node) {
          // The node is not in the list
          return;
        }
        // The only node
        this.first = undefined;
        this.last = undefined;
      } else {
        // The last node but not the first node
        const last = node.prev;
        last.next = undefined;
        node.prev = undefined;
        this.last = last;
      }
    } else if (!node.prev) {
      // The first node but not the last node
      const first = node.next;
      first.prev = undefined;
      node.next = undefined;
      this.first = first;
    } else {
      // Neither the first nor the last node
      node.prev.next = node.next;
      node.next.prev = node.prev;
      node.prev = undefined;
      node.next = undefined;
    }
    this.size--;
  }

  /**
   * Remove the last node from the list.
   *
   * @returns The last node if found, undefined otherwise.
   */
  removeLast(): DoubleLinkedListNode<T> | undefined {
    const last = this.last;
    if (last) {
      this.remove(last);
    }
    return last;
  }
}
