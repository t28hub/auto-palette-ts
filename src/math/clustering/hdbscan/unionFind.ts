/**
 * Implementation of the Union-find data structure.
 *
 * @see [Disjoint-set data structure - Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
 */
export class UnionFind {
  private readonly parents: Uint32Array;
  private readonly sizes: Uint32Array;

  private nextLabel: number;

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

    this.parents = new Uint32Array(2 * n - 1).map((_: number, index: number) => index);
    this.sizes = new Uint32Array(2 * n - 1).fill(1, 0, n);
    this.nextLabel = n;
  }

  /**
   * Find the root node the given node.
   *
   * @param a The node to find.
   * @return The root node of the given node.
   * @throws {RangeError} if the given node is invalid.
   */
  find(a: number): number {
    if (a < 0) {
      throw new RangeError(`The given index is invalid: ${a}`);
    }

    let root = a;
    let current = a;
    while (this.parents[current] !== current) {
      current = this.parents[current];
    }

    while (this.parents[root] !== current) {
      const tmp = this.parents[root];
      this.parents[root] = current;
      root = tmp;
    }
    return current;
  }

  /**
   * Merge the given nodes.
   *
   * @param a The first node to be merged.
   * @param b The other node to be merged.
   * @return The size of merged node.
   * @throws {RangeError} if the given node is invalid.
   */
  union(a: number, b: number): number {
    if (a < 0 || b < 0) {
      throw new RangeError(`Either or both of the given nodes are invalid: a=${a}, b=${b}`);
    }

    const label = this.nextLabel++;
    this.parents[a] = label;
    this.parents[b] = label;

    const total = this.sizes[a] + this.sizes[b];
    this.sizes[label] = total;
    return total;
  }
}
