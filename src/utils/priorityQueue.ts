import { Comparator } from './comparator';
import { Queue } from './queue';

/**
 * Binary heap based priority queue implementation.
 *
 * @param E The type of elements.
 */
export class PriorityQueue<E> implements Queue<E> {
  private readonly elements: E[];

  /**
   * Create a PriorityQueue with the score function.
   *
   * @param comparator The comparator function to compare the elements.
   */
  constructor(private readonly comparator: Comparator<E>) {
    this.elements = [];
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

    let index = this.elements.length - 1;
    // If the index is 0, the element is root element.
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentElement = this.elements[parentIndex];
      if (this.comparator(element, parentElement) >= 0) {
        break;
      }

      this.swap(index, parentIndex);
      index = parentIndex;
    }
    return true;
  }

  /**
   * {@inheritDoc Queue.dequeue}
   */
  dequeue(): E | undefined {
    const rootElement = this.elements[0];
    const lastElement = this.elements.pop();
    // If the last element is undefined, this queue is empty.
    if (!lastElement || this.elements.length === 0) {
      return rootElement;
    }

    this.elements[0] = lastElement;

    let index = 0;
    const limit = this.elements.length;
    while (index < limit) {
      const leftChildIndex = index * 2 + 1;
      const rightChildIndex = leftChildIndex + 1;

      const leftChild = this.elements[leftChildIndex];
      const rightChild = this.elements[rightChildIndex];
      // If both child elements are not present, stop reordering this binary tree.
      if (!leftChild && !rightChild) {
        break;
      }

      if (!rightChild) {
        if (this.comparator(lastElement, leftChild) <= 0) {
          break;
        }

        this.swap(index, leftChildIndex);
        index = leftChildIndex;
        continue;
      }

      if (this.comparator(lastElement, leftChild) < 0 && this.comparator(lastElement, rightChild) < 0) {
        break;
      }

      if (this.comparator(leftChild, rightChild) < 0) {
        this.swap(index, leftChildIndex);
        index = leftChildIndex;
      } else {
        this.swap(index, rightChildIndex);
        index = rightChildIndex;
      }
    }
    return rootElement;
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

  private swap(index1: number, index2: number) {
    const temporary = this.elements[index1];
    this.elements[index1] = this.elements[index2];
    this.elements[index2] = temporary;
  }
}
