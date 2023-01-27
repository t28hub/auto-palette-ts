import { PriorityQueue } from '../../utils';
import { Graph, SpanningTree, WeightedEdge } from '../types';

/**
 * Minimum spanning tree(MST) implementation.
 *
 * @param E The type of edge.
 * @see [Minimum spanning tree - Wikipedia](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
 */
export class MinimumSpanningTree<E extends WeightedEdge> implements SpanningTree<E> {
  /**
   * Create a new minimum spanning tree.
   *
   * @param edges The all edges of this tree.
   * @param weight The weight of this tree
   * @private
   */
  private constructor(private readonly edges: E[], readonly weight: number) {}

  /**
   * {@inheritDoc SpanningTree.getEdges}
   */
  getEdges(): E[] {
    return Array.from(this.edges);
  }

  /**
   * Build a new spanning tree using the Prim's algorithm.
   *
   * @param graph The source graph.
   * @return The new minimum spanning tree.
   */
  static prim<V, E extends WeightedEdge>(graph: Graph<V, E>): SpanningTree<E> {
    const vertices = graph.getVertices();
    if (vertices.length <= 1) {
      return new MinimumSpanningTree<E>([], 0.0);
    }

    const edges = new Array<E>();
    const attached = new Set<number>();
    const candidates = new PriorityQueue<E>((edge: E): number => -edge.weight);

    const verticesCount = graph.countVertices();
    let totalWeight = 0.0;
    let currentIndex = verticesCount - 1;
    attached.add(currentIndex);
    while (attached.size < verticesCount) {
      for (let i = 0; i < verticesCount; i++) {
        if (currentIndex === i || attached.has(i)) {
          continue;
        }

        const edge = graph.getEdge(currentIndex, i);
        candidates.enqueue(edge);
      }

      while (!candidates.isEmpty) {
        const head = candidates.dequeue();
        if (!head) {
          throw new Error(`No edge at ${currentIndex} was found`);
        }

        if (!attached.has(head.v)) {
          edges.push(head);
          attached.add(head.v);
          currentIndex = head.v;
          totalWeight += head.weight;
          break;
        }
      }
    }
    return new MinimumSpanningTree<E>(edges, totalWeight);
  }
}
