/**
 * Interface representing a Matrix.
 */
export interface Matrix {
  /**
   * Return the total number of elements in the matrix.
   *
   * @returns The total number of elements.
   */
  get size(): number;

  /**
   * Return the dimensions of the matrix.
   *
   * @returns A tuple of the form [rows, columns].
   */
  get dimensions(): [number, number];

  /**
   * Set the value at the specified row and column.
   *
   * @param i The row index.
   * @param j The column index.
   * @param value The new value to set.
   * @throws {@link IndexOutOfBoundsError} if the row or column index is out of bounds.
   */
  set(i: number, j: number, value: number): void;

  /**
   * Return the value at the specified row and column.
   *
   * @param i The row index.
   * @param j The column index.
   * @returns The value at the specified row and column.
   * @throws {@link IndexOutOfBoundsError} if the row or column index is out of bounds.
   */
  get(i: number, j: number): number;
}
