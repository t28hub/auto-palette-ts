import { Cluster, Clustering, DistanceFunction, Point } from '../../types';
import { HierarchicalClustering, HierarchicalNode } from '../hierarchical';
import { MutableCluster } from '../mutableCluster';

import { CondensedNode } from './condensedNode';
import { CoreDistance } from './coreDistance';
import { MutualReachabilityDistance } from './mutualReachabilityDistance';
import { UnionFind } from './unionFind';

/**
 * Hierarchical density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [How HDBSCAN Works](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html)
 */
export class HDBSCAN<P extends Point> implements Clustering<P> {
  /**
   * Create a new HDBSCAN.
   *
   * @param minPoints The minimum number of points to compute core distance.
   * @param minClusterSize The minimum number of points required to build a cluster
   * @param distanceFunction The distance function.
   */
  constructor(
    private readonly minPoints: number,
    private readonly minClusterSize: number,
    private readonly distanceFunction: DistanceFunction<P>,
  ) {
    if (minPoints < 1) {
      throw new RangeError(`The minimum number of points is less than 1: ${minPoints}`);
    }
    if (minClusterSize < 1) {
      throw new RangeError(`The minimum number of cluster size is less than 1: ${minClusterSize}`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      return [];
    }

    // https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#build-the-minimum-spanning-tree
    const coreDistance = CoreDistance.from(points, this.minPoints, this.distanceFunction);
    const weightFunction = new MutualReachabilityDistance(points, coreDistance, this.distanceFunction);
    const hierarchicalClustering = new HierarchicalClustering(1, weightFunction);
    const hierarchicalTree = hierarchicalClustering.buildTree(points);
    const condensedTree = this.condenseTree(hierarchicalTree);
    return this.extractClusters(condensedTree, points);
  }

  /**
   * @param hierarchicalTree
   *
   * @private
   * @see [Condense the cluster tree](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#condense-the-cluster-tree)
   */
  private condenseTree(hierarchicalTree: HierarchicalNode[]): CondensedNode[] {
    const edgeSize = hierarchicalTree.length;
    const pointSize = edgeSize + 1;
    const root = edgeSize * 2;

    const relabel = new Uint32Array(root + 1);
    relabel[root] = pointSize;

    let nextLabel = pointSize + 1;
    const nodeIds = HDBSCAN.bfsHierarchy(hierarchicalTree, root);
    const visited = new Set<number>();
    const condensed = new Array<CondensedNode>();
    nodeIds.forEach((nodeId: number) => {
      if (visited.has(nodeId) || nodeId < pointSize) {
        return;
      }

      const cluster = hierarchicalTree[nodeId - pointSize];
      const { left, right, weight } = cluster;
      let lambda = Number.MAX_VALUE;
      if (weight > 0.0) {
        lambda = 1.0 / weight;
      }

      // If the node is leaf, the count is equal to 1
      const leftSize = hierarchicalTree.at(left - pointSize)?.size ?? 1;
      const rightSize = hierarchicalTree.at(right - pointSize)?.size ?? 1;
      if (leftSize >= this.minClusterSize && rightSize >= this.minClusterSize) {
        relabel[left] = nextLabel;
        condensed.push({ parent: relabel[nodeId], child: relabel[left], lambda, size: leftSize });
        nextLabel++;

        relabel[right] = nextLabel;
        condensed.push({ parent: relabel[nodeId], child: relabel[right], lambda, size: rightSize });
        nextLabel++;
        return;
      }

      if (leftSize < this.minClusterSize && rightSize < this.minClusterSize) {
        HDBSCAN.bfsHierarchy(hierarchicalTree, nodeId).forEach((childNodeId: number) => {
          // Ignore own node ID.
          if (childNodeId === nodeId) {
            return;
          }
          if (childNodeId < pointSize) {
            condensed.push({ parent: relabel[nodeId], child: childNodeId, lambda, size: 1 });
          }
          visited.add(childNodeId);
        });
        return;
      }

      if (leftSize < this.minClusterSize) {
        relabel[right] = relabel[nodeId];
        HDBSCAN.bfsHierarchy(hierarchicalTree, left).forEach((childNodeId: number) => {
          if (childNodeId < pointSize) {
            condensed.push({ parent: relabel[nodeId], child: childNodeId, lambda, size: 1 });
          }
          visited.add(childNodeId);
        });
        return;
      }

      if (rightSize < this.minClusterSize) {
        relabel[left] = relabel[nodeId];
        HDBSCAN.bfsHierarchy(hierarchicalTree, right).forEach((childNodeId: number) => {
          if (childNodeId < pointSize) {
            condensed.push({ parent: relabel[nodeId], child: childNodeId, lambda, size: 1 });
          }
          visited.add(childNodeId);
        });
        return;
      }
    });
    return condensed;
  }

  /**
   *
   * @param condensedTree
   * @param points
   * @private
   * @see [Extract the clusters](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#extract-the-clusters)
   */
  private extractClusters(condensedTree: CondensedNode[], points: P[]): Cluster<P>[] {
    const stability = HDBSCAN.computeStability(condensedTree);
    const nodeIds = Array.from(stability.keys())
      .sort((nodeId1: number, nodeId2: number): number => nodeId2 - nodeId1)
      .slice(0, -1);
    const clusterIds = new Set<number>(stability.keys());

    const tree = condensedTree.filter((node: CondensedNode): boolean => node.size > 1);
    nodeIds.forEach((nodeId: number) => {
      const childStability = tree.reduce((total: number, node: CondensedNode): number => {
        if (node.parent === nodeId) {
          total += stability.get(node.child) ?? 0.0;
        }
        return total;
      }, 0.0);

      const currentStability = stability.get(nodeId) ?? Number.MAX_VALUE;
      if (currentStability < childStability) {
        clusterIds.delete(nodeId);
        stability.set(nodeId, childStability);
        return;
      }

      HDBSCAN.bfsTree(tree, nodeId).forEach((childNodeId: number) => {
        if (childNodeId !== nodeId) {
          clusterIds.delete(childNodeId);
        }
      });
    });

    const sortedTree = condensedTree.sort((node1: CondensedNode, node2: CondensedNode): number => {
      return node2.parent - node1.parent;
    });
    const maxParent = sortedTree[0].parent;
    const minParent = sortedTree[sortedTree.length - 1].parent;
    const unionFind = new UnionFind(maxParent + 1);
    condensedTree.forEach((node: CondensedNode) => {
      if (clusterIds.has(node.child)) {
        return;
      }
      unionFind.union(node.parent, node.child);
    });

    const outliers = new Set<number>();
    const clusters = new Map<number, MutableCluster<P>>();
    for (let nodeId = 0; nodeId < minParent; nodeId++) {
      const clusterId = unionFind.find(nodeId);
      if (clusterId > minParent) {
        const cluster = clusters.get(clusterId) ?? new MutableCluster<P>(clusterId);
        cluster.add(points[nodeId]);
        clusters.set(clusterId, cluster);
      } else {
        outliers.add(nodeId);
      }
    }
    return Array.from(clusters.values());
  }

  private static computeStability(condensedTree: CondensedNode[]): Map<number, number> {
    const births = condensedTree.reduce((births: Map<number, number>, node: CondensedNode): Map<number, number> => {
      const birth = births.get(node.child) ?? Number.MAX_VALUE;
      births.set(node.child, Math.min(node.lambda, birth));
      return births;
    }, new Map<number, number>());

    const sortedTree = condensedTree.sort((node1: CondensedNode, node2: CondensedNode): number => {
      return node1.parent - node2.parent;
    });
    const minClusterId = sortedTree[0].parent;
    births.set(minClusterId, 0.0);

    return condensedTree.reduce((stability: Map<number, number>, node: CondensedNode): Map<number, number> => {
      const { parent, lambda, size } = node;
      const birth = births.get(parent) ?? 0.0;
      const previous = stability.get(parent);
      if (previous) {
        stability.set(parent, (lambda - birth) * size + previous);
      } else {
        stability.set(parent, (lambda - birth) * size);
      }
      return stability;
    }, new Map<number, number>());
  }

  private static bfsHierarchy(hierarchy: HierarchicalNode[], rootNodeId: number): number[] {
    const edgeSize = hierarchy.length;
    const pointSize = edgeSize + 1;

    let toProcess = [rootNodeId];
    const nodeIds = new Array<number>();
    while (toProcess.length > 0) {
      nodeIds.push(...toProcess);
      toProcess = toProcess.flatMap((nodeId: number): number[] => {
        if (nodeId < pointSize) {
          return [];
        }

        const node = hierarchy[nodeId - pointSize];
        return [node.left, node.right];
      });
    }
    return nodeIds;
  }

  private static bfsTree(tree: CondensedNode[], rootNodeId: number): number[] {
    let toProcess = [rootNodeId];
    const nodeIds = new Array<number>();
    while (toProcess.length > 0) {
      nodeIds.push(...toProcess);
      toProcess = tree
        .filter((node: CondensedNode) => toProcess.indexOf(node.parent) !== -1)
        .map((node: CondensedNode) => node.child);
    }
    return nodeIds;
  }
}
