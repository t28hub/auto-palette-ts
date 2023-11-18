import { ArrayQueue, Ordering, PriorityQueue } from '../../../utils';
import { MinimumSpanningTree } from '../../graph';
import { Point } from '../../point';
import { WeightedEdge, WeightFunction } from '../../types';
import { ClusteringAlgorithm } from '../algorithm';
import { Cluster, MutableCluster } from '../cluster';

import { HierarchicalNode } from './types';
import { UnionFind } from './unionFind';

export { type HierarchicalNode } from './types';

/**
 * Hierarchical clustering algorithm implementation.
 *
 * @param P The type of point.
 * @see [Hierarchical clustering - Wikipedia](https://en.wikipedia.org/wiki/Hierarchical_clustering)
 */
export class HierarchicalClustering<P extends Point> implements ClusteringAlgorithm<P> {
  /**
   * Create a new HierarchicalClustering.
   *
   * @param k The number of clusters.
   * @param weightFunction The weight function.
   */
  constructor(
    private readonly k: number,
    private readonly weightFunction: WeightFunction,
  ) {
    if (k < 1) {
      throw new RangeError(`The number of cluster is less than 1: ${k}`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    const hierarchy = this.hierarchize(points);
    const labels = this.labelHierarchy(hierarchy);
    const clusters = points.reduce(
      (clusters: Map<number, MutableCluster<P>>, point: P, index: number): Map<number, MutableCluster<P>> => {
        const label = labels[index];
        const cluster = clusters.get(label) ?? new MutableCluster<P>(label);
        cluster.add(point);
        clusters.set(label, cluster);
        return clusters;
      },
      new Map<number, MutableCluster<P>>(),
    );
    return Array.from(clusters.values());
  }

  /**
   * Label the given points.
   *
   * @param points The points to be labeled.
   * @return The labels.
   */
  label(points: P[]): Uint32Array {
    const hierarchy = this.hierarchize(points);
    return this.labelHierarchy(hierarchy);
  }

  /**
   * Hierarchize the given points.
   *
   * @param points The points to be hierarchized.
   * @return The hierarchized tree.
   */
  hierarchize(points: P[]): HierarchicalNode[] {
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

  private labelHierarchy(hierarchy: HierarchicalNode[]): Uint32Array {
    const edgeSize = hierarchy.length;
    const pointSize = edgeSize + 1;
    const labels = new Uint32Array(pointSize);
    if (this.k < 2) {
      return labels;
    }

    if (this.k >= pointSize) {
      return labels.map((_: number, index: number): number => index);
    }

    const nodeIds = new PriorityQueue<number>((nodeId1: number, nodeId2: number): Ordering => {
      if (nodeId1 < nodeId2) {
        return -1;
      }
      if (nodeId1 > nodeId2) {
        return 1;
      }
      return 0;
    });
    const rootNodeId = edgeSize * 2;
    nodeIds.push(rootNodeId);
    while (nodeIds.size < this.k) {
      const nodeId = nodeIds.pop();
      if (typeof nodeId === 'undefined') {
        break;
      }

      const node = hierarchy[nodeId - pointSize];
      nodeIds.push(node.left);
      nodeIds.push(node.right);
    }

    let clusterId = 0;
    while (!nodeIds.isEmpty) {
      const nodeId = nodeIds.pop();
      if (typeof nodeId === 'undefined') {
        break;
      }

      if (nodeId >= pointSize) {
        this.bfs(hierarchy, nodeId, clusterId, labels);
      } else {
        labels[nodeId] = clusterId;
      }
      clusterId++;
    }
    return labels;
  }

  private bfs(hierarchy: HierarchicalNode[], rootNodeId: number, clusterId: number, labels: Uint32Array) {
    const edgeSize = hierarchy.length;
    const pointSize = edgeSize + 1;
    const rootNode = hierarchy[rootNodeId - pointSize];
    const queue = new ArrayQueue(rootNode);
    while (!queue.isEmpty) {
      const node = queue.pop();
      if (typeof node === 'undefined') {
        break;
      }

      const left = node.left;
      if (left >= pointSize) {
        queue.push(hierarchy[left - pointSize]);
      } else {
        labels[left] = clusterId;
      }

      const right = node.right;
      if (right >= pointSize) {
        queue.push(hierarchy[right - pointSize]);
      } else {
        labels[right] = clusterId;
      }
    }
  }
}
