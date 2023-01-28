import { MinimumSpanningTree } from '../../graph';
import { Point, SpanningTree, WeightedEdge, WeightFunction } from '../../types';

import { UnionFind } from './unionFind';

export interface Node {
  readonly left: number;
  readonly right: number;
  readonly weight: number;
  readonly size: number;
}

export class SingleLinkage<P extends Point> {
  constructor(private readonly weightFunction: WeightFunction) {}

  fit(points: P[]): Node[] {
    if (points.length === 0) {
      return [];
    }

    const spanningTree = MinimumSpanningTree.fromVertices(points, this.weightFunction);
    return this.buildNodes(spanningTree);
  }

  private buildNodes(spanningTree: SpanningTree<WeightedEdge>): Node[] {
    const edges = spanningTree.getEdges().sort((edge1: WeightedEdge, edge2: WeightedEdge): number => {
      return edge1.weight - edge2.weight;
    });
    const edgeSize = edges.length;

    const nodeSize = edgeSize + 1;
    const unionFind = new UnionFind(nodeSize);
    return edges.map((_: unknown, nodeId: number): Node => {
      const edge = edges[nodeId];
      const rootU = unionFind.find(edge.u);
      const rootV = unionFind.find(edge.v);
      const size = unionFind.union(rootU, rootV);
      return { left: rootU, right: rootV, weight: edge.weight, size };
    });
  }
}
