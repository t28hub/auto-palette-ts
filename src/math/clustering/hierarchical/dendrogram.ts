import { PriorityQueue } from '../../../utils';

/**
 * Type representing a step of the dendrogram.
 */
export type Step = {
  // The label of the step.
  readonly label: number;
  // The index of the first child step.
  readonly childIndex1: number;
  // The index of the second child step.
  readonly childIndex2: number;
  // The distance between the first child step and the second child step.
  readonly distance: number;
  // The size of the step.
  readonly size: number;
};

export class Dendrogram {
  private readonly steps: Step[] = [];

  /**
   * Creates a new dendrogram with the specified size.
   *
   * @param size The size of the dendrogram.
   * @throws {TypeError} The size is less than 1.
   */
  constructor(private readonly size: number) {
    if (!Number.isInteger(size) || size < 1) {
      throw new TypeError(`The size(${size}) is less than 1.`);
    }
    this.steps = [];
  }

  /**
   * Returns the length of the dendrogram.
   */
  get length(): number {
    return Math.floor((this.size + 1) / 2);
  }

  /**
   * Returns true if the dendrogram is empty.
   */
  get isEmpty(): boolean {
    return this.steps.length === 0;
  }

  /**
   * Push the given step to the dendrogram.
   *
   * @param step The step to push.
   * @throws {RangeError} The dendrogram size is exceeded.
   */
  push(step: Step): void {
    if (this.size <= this.steps.length) {
      throw new RangeError(`The dendrogram size(${this.size}) is exceeded.`);
    }
    this.steps.push(step);
  }

  /**
   * Return the step at the specified index.
   *
   * @param index The index of the step.
   * @returns The step at the specified index.
   */
  stepAt(index: number): Step | undefined {
    return this.steps[index];
  }

  /**
   * Iterate over the steps of the dendrogram.
   *
   * @param callback The callback function.
   */
  forEach(callback: (step: Step, index: number) => void): void {
    this.steps.forEach((step: Step, index: number) => callback(step, index));
  }

  /**
   * Partition the dendrogram into the specified number of clusters.
   *
   * @param n The number of clusters.
   * @returns The labels of the clusters.
   */
  partition(n: number): number[] {
    const maxSize = (this.size + 1) / 2;
    if (n > maxSize) {
      throw new RangeError(`The number of clusters(${n}) exceeds the dendrogram size(${maxSize}).`);
    }

    const lastStep = this.steps[this.steps.length - 1];
    if (!lastStep) {
      return [];
    }

    const queue = new PriorityQueue((step1: Step, step2: Step) => {
      if (step1.distance < step2.distance) {
        return -1;
      }
      if (step1.distance > step2.distance) {
        return 1;
      }
      return 0;
    });
    queue.push(lastStep);

    let partitionCount = 0;
    const membership: Step[] = [];
    while (partitionCount < n - 1) {
      const step = queue.pop();
      if (!step) {
        break;
      }

      const childStep1 = this.steps[step.childIndex1];
      const childStep2 = this.steps[step.childIndex2];
      if (!childStep1 || !childStep2) {
        membership.push({ ...step });
        continue;
      }

      if (childStep1) {
        queue.push(childStep1);
      }
      if (childStep2) {
        queue.push(childStep2);
      }
      partitionCount++;
    }

    let label = 0;
    const labels: number[] = [];
    membership.forEach((step) => (labels[step.label] = label++));
    queue.toArray().forEach((step) => this.assignLabel(step, label++, labels));
    return labels;
  }

  private assignLabel(root: Step, label: number, labels: number[]): void {
    const childStep1 = this.steps[root.childIndex1];
    const childStep2 = this.steps[root.childIndex2];
    if (childStep1 && childStep2) {
      this.assignLabel(childStep1, label, labels);
      this.assignLabel(childStep2, label, labels);
    } else {
      labels[root.label] = label;
    }
  }
}
