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
   * @param x The node to find.
   * @return The root node of the given node.
   * @throws {RangeError} if the given node is invalid.
   */
  find(x: number): number {
    if (x < 0) {
      throw new RangeError(`The given index is invalid: ${x}`);
    }

    let root = x;
    let parent = x;
    // Find the root node of given index.
    while (this.parents[root] !== root) {
      root = this.parents[root];
    }

    while (this.parents[parent] !== root) {
      parent = this.parents[parent];
      this.parents[parent] = root;
    }
    return root;
  }

  /**
   * Merge the given nodes.
   *
   * @param x The first node to be merged.
   * @param y The other node to be merged.
   * @return The size of merged node.
   * @throws {RangeError} if the given node is invalid.
   */
  union(x: number, y: number): number {
    if (x < 0 || y < 0) {
      throw new RangeError(`Either or both of the given nodes are invalid: x=${x}, y=${y}`);
    }

    const label = this.nextLabel;
    this.parents[x] = label;
    this.parents[y] = label;

    const total = this.sizes[x] + this.sizes[y];
    this.sizes[label] = total;

    this.nextLabel++;
    return total;
  }
}
