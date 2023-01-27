import { MinimumSpanningTree } from '../../graph';
import { Cluster, Clustering, DistanceFunction, Point, SpanningTree, WeightedEdge } from '../../types';

import { HDBSCANCluster } from './cluster';
import { CoreDistance } from './coreDistance';
import { PointGraph } from './pointGraph';
import { UnionFind } from './unionFind';

class TreeUnionFind {
  private readonly parents: Uint32Array;
  private readonly sizes: Uint32Array;
  private readonly components: Set<number>;

  constructor(readonly n: number) {
    if (n < 1) {
      throw new RangeError(`The number of node is less than 1: ${n}`);
    }
    this.parents = new Uint32Array(n).map((_: number, index: number) => index);
    this.sizes = new Uint32Array(n);
    this.components = new Set<number>(this.parents);
  }

  find(a: number): number {
    if (this.parents[a] !== a) {
      const rootA = this.parents[a];
      this.parents[a] = this.find(rootA);
      this.components.delete(a);
    }
    return this.parents[a];
  }

  union(a: number, b: number) {
    const rootA = this.parents[a];
    const rootB = this.parents[b];

    const rootSizeA = this.sizes[rootA];
    const rootSizeBB = this.sizes[rootB];
    if (rootSizeA < rootSizeBB) {
      this.parents[rootA] = rootB;
    } else if (rootSizeA > rootSizeBB) {
      this.parents[rootB] = rootA;
    } else {
      this.parents[rootB] = rootA;
      this.sizes[rootA]++;
    }
  }

  getComponents(): number[] {
    return Array.from(this.components);
  }
}

interface HierarchyNode {
  readonly parent: number;
  readonly child: number;
  readonly lambda: number;
  readonly size: number;
}

interface HierarchicalCluster {
  readonly parent: number;
  readonly child: number;
  readonly height: number;
  readonly size: number;
}

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

    const coreDistance = CoreDistance.from(points, this.minPoints, this.distanceFunction);
    const pointGraph = new PointGraph(points, coreDistance, this.distanceFunction);
    // https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#build-the-minimum-spanning-tree
    const minimumSpanningTree = MinimumSpanningTree.prim(pointGraph);
    console.info(minimumSpanningTree.getEdges());
    const hierarchy = this.buildSingleLinkage(minimumSpanningTree);
    console.table(hierarchy);

    const condensedTree = this.condenseTree(hierarchy);
    console.table(condensedTree);

    return this.extractClusters(condensedTree, points);
  }

  /**
   * Build the cluster hierarchy using the single linkage.
   *
   * @param spanningTree The minimum spanning tree.
   * @return The built single linkage.
   *
   * @private
   * @see [Build the cluster hierarchy](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#build-the-cluster-hierarchy)
   */
  private buildSingleLinkage(spanningTree: SpanningTree<WeightedEdge>): HierarchicalCluster[] {
    // Sort all edges in ascending order of weight.
    const edges = spanningTree.getEdges().sort((edge1: WeightedEdge, edge2: WeightedEdge): number => {
      return edge1.weight - edge2.weight;
    });

    // Build the cluster hierarchy.
    const unionFind = new UnionFind(edges.length + 1);
    return edges.map((edge: WeightedEdge) => {
      const parent = unionFind.find(edge.u);
      const child = unionFind.find(edge.v);
      const size = unionFind.union(parent, child);
      return { parent, child, height: edge.weight, size };
    });
  }

  /**
   * @param hierarchy
   *
   * @private
   * @see [Condense the cluster tree](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html#condense-the-cluster-tree)
   */
  private condenseTree(hierarchy: HierarchicalCluster[]): HierarchyNode[] {
    const edgeSize = hierarchy.length;
    const pointSize = edgeSize + 1;
    const root = edgeSize * 2;

    const relabel = new Uint32Array(root + 1);
    relabel[root] = pointSize;

    let nextLabel = pointSize + 1;
    const nodeIds = HDBSCAN.bfsHierarchy(hierarchy, root);
    const visited = new Set<number>();
    const condensed = new Array<HierarchyNode>();
    nodeIds.forEach((nodeId: number) => {
      if (visited.has(nodeId) || nodeId < pointSize) {
        return;
      }

      const currentCluster = hierarchy[nodeId - pointSize];
      let lambda = Number.MAX_VALUE;
      if (currentCluster.height > 0.0) {
        lambda = 1.0 / currentCluster.height;
      }

      const left = currentCluster.parent;
      const right = currentCluster.child;

      // If the node is leaf, the count is equal to 1
      const leftSize = hierarchy.at(left - pointSize)?.size ?? 1;
      const rightSize = hierarchy.at(right - pointSize)?.size ?? 1;

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
        HDBSCAN.bfsHierarchy(hierarchy, nodeId).forEach((childNodeId: number) => {
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
        HDBSCAN.bfsHierarchy(hierarchy, left).forEach((childNodeId: number) => {
          if (childNodeId < pointSize) {
            condensed.push({ parent: relabel[nodeId], child: childNodeId, lambda, size: 1 });
          }
          visited.add(childNodeId);
        });
        return;
      }

      if (rightSize < this.minClusterSize) {
        relabel[left] = relabel[nodeId];
        HDBSCAN.bfsHierarchy(hierarchy, right).forEach((childNodeId: number) => {
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
  private extractClusters(condensedTree: HierarchyNode[], points: P[]): HDBSCANCluster<P>[] {
    const stability = this.computeStability(condensedTree);
    const clusterLabels = new Set<number>(stability.keys());
    const nodes = Array.from(clusterLabels).sort((node1: number, node2: number): number => node2 - node1);
    nodes.pop(); // Remove last node

    const clusterTree = condensedTree.filter(({ size }) => size > 1);
    nodes.forEach((node: number) => {
      const childStability = clusterTree
        .filter(({ parent }) => parent === node)
        .reduce((total: number, { child }): number => {
          total += stability.get(child) ?? 0.0;
          return total;
        }, 0.0);

      const currentStability = stability.get(node) ?? 0.0;
      if (currentStability < childStability) {
        clusterLabels.delete(node);
        stability.set(node, childStability);
        return;
      }

      HDBSCAN.bfsTree(clusterTree, node).forEach((child: number) => {
        if (child === node) {
          return;
        }
        clusterLabels.delete(child);
      });
    });

    console.info(clusterLabels);

    const sortedTree = condensedTree.sort((node1, node2): number => {
      return node2.parent - node1.parent;
    });
    const maxParent = sortedTree[0].parent;
    const minParent = sortedTree[sortedTree.length - 1].parent;
    const unionFind = new TreeUnionFind(maxParent + 1);
    condensedTree.forEach(({ parent, child }) => {
      if (clusterLabels.has(child)) {
        return;
      }
      unionFind.union(parent, child);
    });

    const outlierSet = new Set<number>();
    const clusterMap = new Map<number, HDBSCANCluster<P>>();
    for (let node = 0; node < minParent; node++) {
      const parent = unionFind.find(node);
      if (parent > minParent) {
        const cluster = clusterMap.get(parent) ?? new HDBSCANCluster<P>(parent);
        cluster.append(points[node]);
        clusterMap.set(parent, cluster);
      } else {
        outlierSet.add(node);
      }
    }
    return Array.from(clusterMap.values());
  }

  private computeStability(condensedTree: HierarchyNode[]): Map<number, number> {
    const births = condensedTree.reduce((births: Map<number, number>, node: HierarchyNode): Map<number, number> => {
      const birth = births.get(node.child);
      if (birth) {
        births.set(node.child, Math.min(node.lambda, birth));
      } else {
        births.set(node.child, node.lambda);
      }
      return births;
    }, new Map<number, number>());

    const sortedTree = condensedTree.sort((node1: HierarchyNode, node2: HierarchyNode): number => {
      return node1.parent - node2.parent;
    });
    const minCluster = sortedTree[0].parent;
    births.set(minCluster, 0.0);

    return condensedTree.reduce((stability: Map<number, number>, node: HierarchyNode): Map<number, number> => {
      const { parent, lambda, size } = node;
      const birth = births.get(parent) ?? 0;
      const previous = stability.get(parent);
      if (previous) {
        stability.set(parent, (lambda - birth) * size + previous);
      } else {
        stability.set(parent, (lambda - birth) * size);
      }
      return stability;
    }, new Map<number, number>());
  }

  private static bfsHierarchy(hierarchy: HierarchicalCluster[], root: number): number[] {
    const edgeSize = hierarchy.length;
    const pointSize = edgeSize + 1;

    let queue = [root];
    const result = new Array<number>();
    while (queue.length > 0) {
      result.push(...queue);
      queue = queue.flatMap((label: number): number[] => {
        if (label < pointSize) {
          return [];
        }

        const node = hierarchy[label - pointSize];
        return [node.parent, node.child];
      });
    }
    return result;
  }

  private static bfsTree(tree: HierarchyNode[], root: number): number[] {
    let queue = [root];
    const result = new Array<number>();
    while (queue.length > 0) {
      result.push(...queue);
      queue = tree
        .filter((node: HierarchyNode) => queue.indexOf(node.parent) !== -1)
        .map((node: HierarchyNode) => node.child);
    }
    return result;
  }
}
