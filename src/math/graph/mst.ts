import { PriorityQueue } from '../../utils';
import { Graph, WeightedEdge } from '../types';

/**
 * Minimum spanning tree(MST) representation.
 *
 * @see [Minimum spanning tree - Wikipedia](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
 */
export class MinimumSpanningTree implements Graph<WeightedEdge> {
  /**
   * Create a new MinimumSpanningTree from all edges.
   *
   * @param edges The all edges.
   * @private
   */
  private constructor(private readonly edges: WeightedEdge[]) {}

  /**
   * {@inheritDoc Graph.isEmpty}
   */
  get isEmpty(): boolean {
    return this.edges.length === 0;
  }

  /**
   * {@inheritDoc Graph.getEdges}
   */
  getEdges(): WeightedEdge[] {
    return Array.from(this.edges);
  }

  /**
   * Build a minimum spanning tree using the Prim's algorithm.
   *
   * @param vertices The array of all vertices.
   * @param weightFunction The weight function.
   * @return The built minimum spanning tree.
   *
   * @see [Prim's algorithm - Wikipedia](https://en.wikipedia.org/wiki/Prim%27s_algorithm)
   */
  static prim<V>(vertices: V[], weightFunction: (index1: number, index2: number) => number): MinimumSpanningTree {
    if (vertices.length === 0) {
      return new MinimumSpanningTree([]);
    }

    const edges = new Array<WeightedEdge>();
    const attached = new Set<number>();
    const candidates = new PriorityQueue((edge: WeightedEdge): number => -edge.weight);
    let currentIndex = vertices.length - 1;
    attached.add(currentIndex);

    while (attached.size < vertices.length) {
      vertices.forEach((_vertex: V, index: number) => {
        if (currentIndex == index || attached.has(index)) {
          return;
        }

        const weight = weightFunction(currentIndex, index);
        candidates.enqueue({ u: currentIndex, v: index, weight });
      });

      while (!candidates.isEmpty) {
        const head = candidates.dequeue();
        if (!head) {
          throw new Error(`No edge at ${currentIndex} was found`);
        }

        if (!attached.has(head.v)) {
          edges.push(head);
          attached.add(head.v);
          currentIndex = head.v;
          break;
        }
      }
    }
    return new MinimumSpanningTree(edges);
  }
}
