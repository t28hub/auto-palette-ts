import { IndexOutOfBoundsError } from '../../error';
import { Matrix } from '../../matrix';

/**
 * A distance matrix.
 */
export class DistanceMatrix implements Matrix {
  private readonly components: number[];

  /**
   * Create a distance matrix with the given size.
   *
   * @param n The size of the matrix.
   * @param initialValue The initial value of the matrix.
   * @throws {@link TypeError} if the `n` is not a positive integer.
   */
  constructor(
    private readonly n: number,
    initialValue: number = Number.POSITIVE_INFINITY,
  ) {
    if (!Number.isInteger(n) || n <= 0) {
      throw new TypeError(`The n(${n}) must be a positive integer.`);
    }
    const capacity = (n * (n + 1)) / 2;
    this.components = new Array(capacity).fill(initialValue);
  }

  /**
   * {@inheritDoc Matrix.size}
   */
  get size(): number {
    return this.n * this.n;
  }

  /**
   * {@inheritDoc Matrix.dimensions}
   */
  get dimensions(): [number, number] {
    return [this.n, this.n];
  }

  /**
   * {@inheritDoc Matrix.get}
   */
  get(i: number, j: number): number {
    const index = this.index(i, j);
    return this.components[index];
  }

  /**
   * {@inheritDoc Matrix.set}
   */
  set(i: number, j: number, value: number): void {
    const index = this.index(i, j);
    this.components[index] = value;
  }

  private index(i: number, j: number): number {
    if (!Number.isInteger(i) || i < 0 || i >= this.n) {
      throw new IndexOutOfBoundsError(`The row(${i}) must be an integer in [0, ${this.n}).`);
    }
    if (!Number.isInteger(j) || j < 0 || j >= this.n) {
      throw new IndexOutOfBoundsError(`The column(${j}) must be an integer in [0, ${this.n}).`);
    }

    // Calculate the index in the components array for the given row and column.
    const min = Math.min(i, j);
    const max = Math.max(i, j);
    return this.components.length - ((this.n - min + 1) * (this.n - min)) / 2 + max - min;
  }
}
