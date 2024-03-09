import { assert, ArrayQueue } from '../../../utils';
import type { DistanceMeasure } from '../../distance';
import { KDTreeSearch, type Neighbor, type NeighborSearch } from '../../neighbor';
import type { Point } from '../../point';
import { Vector } from '../../vector';
import type { ClusteringAlgorithm } from '../algorithm';
import { Cluster } from '../cluster';

type Label = number;

const OUTLIER: Label = -1;
const MARKED: Label = -2;
const UNDEFINED: Label = -3;

/**
 * Implementation of the DBSCAN (Density-Based Spatial Clustering of Applications with Noise) algorithm.
 *
 * @param P The type of point.
 * @see [Wikipedia - DBSCAN](https://en.wikipedia.org/wiki/DBSCAN)
 */
export class DBSCAN<P extends Point> implements ClusteringAlgorithm<P> {
  /**
   * Create a new DBSCAN instance.
   *
   * @param minPoints - The minimum number of points required to form a cluster.
   * @param epsilon - The radius within which to search for neighboring points.
   * @param distanceMeasure - The function to measure the distance between two points.
   */
  constructor(
    private readonly minPoints: number,
    private readonly epsilon: number,
    private readonly distanceMeasure: DistanceMeasure,
  ) {
    assert(this.minPoints >= 1, `The minimum size of cluster(${this.minPoints}) is not greater than or equal to 1`);
    assert(this.epsilon >= 0.0, `The epsilon(${this.epsilon}) is not greater than 0.0`);
  }

  /**
   * {@inheritDoc ClusteringAlgorithm.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    assert(points.length > 0, 'The points array is empty');

    let label: Label = 0;
    const labels = new Array<Label>(points.length).fill(UNDEFINED);
    const clusters = new Array<Cluster<P>>();
    const neighborSearch = KDTreeSearch.build(points, 16, this.distanceMeasure);
    for (let i = 0; i < points.length; i++) {
      // Skip if the point has already been visited.
      if (labels[i] !== UNDEFINED) {
        continue;
      }

      const point = points[i];
      const neighbors = neighborSearch.searchRadius(point, this.epsilon);
      // Mark as noise point if there are not enough neighbors.
      if (neighbors.length < this.minPoints) {
        labels[i] = OUTLIER;
        continue;
      }

      DBSCAN.markNeighbors(neighbors, labels);

      const cluster = this.expandCluster(label, labels, points, neighbors, neighborSearch);
      if (cluster.size >= this.minPoints) {
        clusters.push(cluster);
      }
      label++;
    }
    return clusters;
  }

  /**
   * Expand the cluster and update the labels of the points.
   *
   * @private
   * @param label The label of the current cluster.
   * @param labels The labels of the points.
   * @param points The points to be clustered.
   * @param neighbors The neighbors of the current point.
   * @param neighborSearch The neighbor search instance.
   */
  private expandCluster(
    label: Label,
    labels: Label[],
    points: P[],
    neighbors: Neighbor[],
    neighborSearch: NeighborSearch<P>,
  ): Cluster<P> {
    const centroid = new Vector(points[0]).setZero();
    const cluster = new Cluster<P>(centroid);
    const queue = new ArrayQueue(...neighbors);
    while (!queue.isEmpty()) {
      const neighbor = queue.pop();
      if (!neighbor) {
        continue;
      }

      const neighborIndex = neighbor.index;
      const neighborPoint = points[neighborIndex];
      if (labels[neighborIndex] > 0) {
        // Skip if the point has already been assigned a label.
        continue;
      }

      if (labels[neighborIndex] === OUTLIER) {
        labels[neighborIndex] = label;
        cluster.addMember(neighborIndex, neighborPoint);
        continue;
      }

      labels[neighborIndex] = label;
      cluster.addMember(neighborIndex, neighborPoint);

      const secondaryNeighbors = neighborSearch.searchRadius(neighborPoint, this.epsilon);
      if (secondaryNeighbors.length < this.minPoints) {
        continue;
      }

      for (let i = 0; i < secondaryNeighbors.length; i++) {
        const secondaryNeighbor = secondaryNeighbors[i];
        const secondaryNeighborIndex = secondaryNeighbor.index;
        const secondaryNeighborLabel = labels[secondaryNeighborIndex];
        if (secondaryNeighborLabel === UNDEFINED) {
          labels[secondaryNeighborIndex] = MARKED;
          queue.push(secondaryNeighbor);
        } else if (secondaryNeighborLabel === OUTLIER) {
          queue.push(secondaryNeighbor);
        }
      }
    }
    return cluster;
  }

  /**
   * Mark the neighbors of a point as marked.
   *
   * @param neighbors The neighbors to mark.
   * @param labels The labels of the points.
   */
  private static markNeighbors(neighbors: Neighbor[], labels: Label[]): void {
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      const neighborIndex = neighbor.index;
      labels[neighborIndex] = MARKED;
    }
  }
}
