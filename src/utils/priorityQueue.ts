import { Queue } from './queue';

/**
 * Wrapper type to prevent score recalculation.
 */
type ScoredElement<E> = {
  /**
   * The score corresponding to this element.
   */
  readonly score: number;

  /**
   * The element.
   */
  readonly element: E;
};

/**
 * Implementation of binary heap based priority queue.
 *
 * @param E The type of elements.
 */
export class PriorityQueue<E> implements Queue<E> {
  private readonly elements: ScoredElement<E>[];

  /**
   * Create a PriorityQueue with the score function.
   *
   * @param scoreFunction The score function.
   */
  constructor(private readonly scoreFunction: (element: E) => number) {
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
   * Enqueue the elements to this queue.
   *
   * @param elements The elements to be enqueued.
   * @return true if the elements are enqueued.
   */
  enqueue(...elements: E[]): boolean {
    elements.forEach((element: E) => {
      const score = this.scoreFunction(element);
      this.elements.push({ score, element });

      let index = this.elements.length - 1;
      // If the index is 0, the element is root element.
      while (index > 0) {
        const parentIndex = Math.round((index - 1) / 2);
        const parentElement = this.elements[parentIndex];
        if (score < parentElement.score) {
          break;
        }

        this.swap(index, parentIndex);
        index = parentIndex;
      }
    });
    return true;
  }

  dequeue(): E | undefined {
    const element = this.elements[0];
    const lastElement = this.elements.pop();
    // If the last element is undefined, this queue is empty.
    if (!lastElement || this.elements.length === 0) {
      return element?.element;
    }

    this.elements[0] = lastElement;

    const score = lastElement.score;
    const limit = this.elements.length;
    let index = 0;
    while (index < limit) {
      const child1Index = index * 2 + 1;
      const child2Index = child1Index + 1;

      const child1 = this.elements[child1Index];
      const child2 = this.elements[child2Index];
      // If both child elements are not present, stop reordering this binary tree.
      if (!child1 && !child2) {
        break;
      }

      if (!child2) {
        if (child1.score < score) {
          break;
        }

        this.swap(index, child1Index);
        index = child1Index;
        continue;
      }

      const maxScore = Math.max(score, child1.score, child2.score);
      if (score >= maxScore) {
        break;
      }

      if (child1.score > child2.score) {
        this.swap(index, child1Index);
        index = child1Index;
      } else {
        this.swap(index, child2Index);
        index = child2Index;
      }
    }
    return element.element;
  }

  /**
   * Return an array of all elements.
   *
   * @return The array of all elements.
   */
  toArray(): E[] {
    return this.elements.map((scored: ScoredElement<E>): E => scored.element);
  }

  private swap(index1: number, index2: number) {
    const temporary = this.elements[index1];
    this.elements[index1] = this.elements[index2];
    this.elements[index2] = temporary;
  }
}
