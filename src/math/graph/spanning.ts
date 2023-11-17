import { PriorityQueue } from '../../utils';
import { Graph, SpanningTree, WeightedEdge, WeightFunction } from '../types';

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
  private constructor(
    private readonly edges: E[],
    readonly weight: number,
  ) {}

  /**
   * {@inheritDoc SpanningTree.getEdges}
   */
  getEdges(): E[] {
    return Array.from(this.edges);
  }

  static fromVertices<V>(vertices: V[], weightFunction: WeightFunction): SpanningTree<WeightedEdge> {
    const graph: Graph<V, WeightedEdge> = {
      getEdge(u: number, v: number): WeightedEdge {
        const weight = weightFunction.compute(u, v);
        return { u, v, weight };
      },
      getVertices(): V[] {
        return Array.from(vertices);
      },
      countVertices(): number {
        return vertices.length;
      },
    };
    return this.fromGraph(graph);
  }

  /**
   * Build a new spanning tree using the Prim's algorithm.
   *
   * @param graph The source graph.
   * @return The new minimum spanning tree.
   */
  static fromGraph<V, E extends WeightedEdge>(graph: Graph<V, E>): SpanningTree<E> {
    const vertices = graph.getVertices();
    if (vertices.length <= 1) {
      return new MinimumSpanningTree<E>([], 0.0);
    }

    const edges = new Array<E>();
    const attached = new Set<number>();
    const candidates = new PriorityQueue<E>((edge: E): number => -edge.weight);

    const verticesSize = vertices.length;
    let totalWeight = 0.0;
    let currentIndex = verticesSize - 1;
    attached.add(currentIndex);
    while (attached.size < verticesSize) {
      for (let i = 0; i < verticesSize; i++) {
        if (currentIndex === i || attached.has(i)) {
          continue;
        }

        const edge = graph.getEdge(currentIndex, i);
        if (Number.isFinite(edge.weight)) {
          candidates.enqueue(edge);
        }
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
