import { ArrayQueue } from '../../../utils';
import { MinimumSpanningTree } from '../../graph';
import { Cluster, Clustering, Point, WeightedEdge, WeightFunction } from '../../types';

import { HierarchicalCluster } from './cluster';
import { HierarchicalNode } from './node';
import { UnionFind } from './unionFind';

export { type HierarchicalNode } from './node';

/**
 * Hierarchical clustering algorithm implementation.
 *
 * @param P The type of point.
 * @see [Hierarchical clustering - Wikipedia](https://en.wikipedia.org/wiki/Hierarchical_clustering)
 */
export class HierarchicalClustering<P extends Point> implements Clustering<P> {
  /**
   * Create a new HierarchicalClustering.
   *
   * @param k The number of clusters.
   * @param weightFunction The weight function.
   */
  constructor(private readonly k: number, private readonly weightFunction: WeightFunction) {
    if (k < 1) {
      throw new RangeError(`The number of cluster is less than 1: ${k}`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    const tree = this.buildTree(points);
    return this.buildClusters(points, tree);
  }

  /**
   * Build hierarchical tree from points.
   *
   * @param points The points.
   * @return The hierarchical tree.
   */
  buildTree(points: P[]): HierarchicalNode[] {
    if (points.length === 0) {
      return [];
    }

    const spanningTree = MinimumSpanningTree.fromVertices(points, this.weightFunction);
    const edges = spanningTree.getEdges().sort((edge1: WeightedEdge, edge2: WeightedEdge): number => {
      return edge1.weight - edge2.weight;
    });

    const edgeSize = edges.length;
    const nodeSize = edgeSize + 1;
    const unionFind = new UnionFind(nodeSize);
    return edges.map((_: WeightedEdge, nodeId: number): HierarchicalNode => {
      const edge = edges[nodeId];
      const rootU = unionFind.find(edge.u);
      const rootV = unionFind.find(edge.v);
      const size = unionFind.union(rootU, rootV);
      return { left: rootU, right: rootV, weight: edge.weight, size };
    });
  }

  private buildClusters(points: P[], tree: HierarchicalNode[]): Cluster<P>[] {
    if (this.k < 2) {
      const cluster = new HierarchicalCluster(0, points);
      return [cluster];
    }

    const edgeSize = tree.length;
    const pointSize = edgeSize + 1;
    const nodeIds = [];
    for (let i = 2; i <= this.k; i++) {
      const node = tree[pointSize - i];
      nodeIds.push(node.left, node.right);
    }

    const clusters = [];
    for (let i = 0; i < this.k; i++) {
      const cluster = this.bfs(points, tree, nodeIds[i], i);
      clusters.push(cluster);
    }
    return clusters;
  }

  private bfs(points: P[], tree: HierarchicalNode[], rootNodeId: number, clusterId: number): Cluster<P> {
    const pointSize = points.length;
    const rootNode = tree[rootNodeId - pointSize];
    const cluster = new HierarchicalCluster<P>(clusterId);

    const queue = new ArrayQueue(rootNode);
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      if (!node) {
        break;
      }

      const left = node.left;
      if (left >= pointSize) {
        queue.enqueue(tree[left - pointSize]);
      } else {
        cluster.append(points[left]);
      }

      const right = node.right;
      if (right >= pointSize) {
        queue.enqueue(tree[right - pointSize]);
      } else {
        cluster.append(points[right]);
      }
    }
    return cluster;
  }
}
