import { ArrayQueue } from '../../../utils';
import { DistanceFunction } from '../../distance';
import { KDTreeSearch, Neighbor, NeighborSearch } from '../../neighbor';
import { Point } from '../../point';
import { Vector } from '../../vector';
import { ClusteringAlgorithm } from '../algorithm';
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
   * @param minPoints The minimum number of points required to form a cluster.
   * @param radius The radius within which to search for neighboring points.
   * @param distanceFunction The function to measure the distance between two points.
   * @throws {RangeError} if the given minPoints is less than 1.
   * @throws {RangeError} if the given radius is less than 0.0.
   */
  constructor(
    private readonly minPoints: number,
    private readonly radius: number,
    private readonly distanceFunction: DistanceFunction,
  ) {
    if (minPoints < 1) {
      throw new RangeError(`The minimum size of cluster(${minPoints}) is not greater than or equal to 1`);
    }
    if (radius < 0.0) {
      throw new RangeError(`The radius(${radius}) is not greater than 0.0`);
    }
  }

  /**
   * {@inheritDoc ClusteringAlgorithm.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      throw new Error('The points array is empty');
    }

    let label: Label = 0;
    const labels = new Array<Label>(points.length).fill(UNDEFINED);
    const clusters = new Array<Cluster<P>>();
    const neighborSearch = KDTreeSearch.build(points, this.distanceFunction);
    for (let i = 0; i < points.length; i++) {
      // Skip if the point has already been visited.
      if (labels[i] !== UNDEFINED) {
        continue;
      }

      const point = points[i];
      const neighbors = neighborSearch.searchRadius(point, this.radius);
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
    while (!queue.isEmpty) {
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

      const secondaryNeighbors = neighborSearch.searchRadius(neighborPoint, this.radius);
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
