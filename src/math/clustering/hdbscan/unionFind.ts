/**
 * Implementation of the Union-find data structure.
 *
 * @see [Disjoint-set data structure - Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
 * @private
 */
export class UnionFind {
  private readonly parents: Uint32Array;
  private readonly ranks: Uint32Array;

  /**
   * Create a new UnionFind.
   *
   * @param n The number of nodes.
   * @throws {RangeError} if the number is less than 1.
   */
  constructor(readonly n: number) {
    if (n < 1) {
      throw new RangeError(`The number of node is less than 1: ${n}`);
    }
    this.parents = new Uint32Array(n).map((_: number, index: number) => index);
    this.ranks = new Uint32Array(n);
  }

  /**
   * Find the root node the given node.
   *
   * @param x The node to find.
   * @return The root node of the given node.
   * @throws {RangeError} if the given node is invalid.
   */
  find(x: number): number {
    if (x < 0) {
      throw new RangeError(`The given index is invalid: ${x}`);
    }

    if (this.parents[x] !== x) {
      const rootX = this.parents[x];
      this.parents[x] = this.find(rootX);
    }
    return this.parents[x];
  }

  /**
   * Merge the given nodes.
   *
   * @param x The first node to be merged.
   * @param y The other node to be merged.
   * @return The size of merged node.
   * @throws {RangeError} if the given node is invalid.
   */
  union(x: number, y: number) {
    if (x < 0 || y < 0) {
      throw new RangeError(`Either or both of the given nodes are invalid: x=${x}, y=${y}`);
    }

    const rootX = this.parents[x];
    const rootY = this.parents[y];
    if (rootX === rootY) {
      return;
    }

    if (this.ranks[rootX] < this.ranks[rootY]) {
      this.parents[rootX] = rootY;
      return;
    }

    this.parents[rootY] = rootX;
    if (this.ranks[rootX] === this.ranks[rootY]) {
      this.ranks[rootX]++;
    }
  }
}
