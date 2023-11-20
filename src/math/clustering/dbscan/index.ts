import { ArrayQueue } from '../../../utils';
import { DistanceFunction } from '../../distance';
import { KDTreeSearch, Neighbor, NeighborSearch } from '../../neighbors';
import { Point } from '../../point';
import { ClusteringAlgorithm } from '../algorithm';
import { Cluster, MutableCluster } from '../cluster';

type Label = number;

const NOISE: Label = -1;
const MARKED: Label = -2;
const UNKNOWN: Label = -3;

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
    const neighborSearch = KDTreeSearch.build(points, this.distanceFunction);
    const labels = new Array<Label>(points.length).fill(UNKNOWN);
    const clusters = new Map<Label, MutableCluster<P>>();
    points.forEach((point: P, index: number) => {
      // Skip if the point has already been visited.
      if (labels[index] !== UNKNOWN) {
        return;
      }

      const neighbors = neighborSearch.searchRadius(point, this.radius);
      // Mark as noise point if there are not enough neighbors.
      if (neighbors.length < this.minPoints) {
        labels[index] = NOISE;
        return;
      }

      labels[index] = label;

      const cluster = this.buildClusterAndUpdateLabels(neighborSearch, neighbors, labels, label);
      cluster.add(point);
      clusters.set(label++, cluster);
    });
    return Array.from(clusters.values());
  }

  /**
   * Build a cluster and update labels
   *
   * @private
   * @param neighborSearch The neighbor search instance.
   * @param neighbors The neighbors of the current point.
   * @param labels The labels of the points.
   * @param label The label of the current cluster.
   * @return The built cluster.
   */
  private buildClusterAndUpdateLabels(
    neighborSearch: NeighborSearch<P>,
    neighbors: Neighbor<P>[],
    labels: Label[],
    label: Label,
  ): MutableCluster<P> {
    neighbors.forEach((neighbor: Neighbor<P>) => {
      const index = neighbor.index;
      if (labels[index] === UNKNOWN) {
        labels[index] = MARKED;
      }
    });

    const queue = new ArrayQueue(...neighbors);
    const points = new Set<P>();
    while (!queue.isEmpty) {
      const neighbor = queue.pop();
      if (!neighbor) {
        continue;
      }

      const index = neighbor.index;
      if (labels[index] > 0) {
        continue;
      }

      if (labels[index] === NOISE) {
        labels[index] = label;
        points.add(neighbor.point);
        continue;
      }

      labels[index] = label;
      points.add(neighbor.point);

      const secondaryNeighbors = neighborSearch.searchRadius(neighbor.point, this.radius);
      if (secondaryNeighbors.length < this.minPoints) {
        continue;
      }

      for (const secondaryNeighbor of secondaryNeighbors) {
        const secondaryIndex = secondaryNeighbor.index;
        const secondaryLabel = labels[secondaryIndex];
        if (secondaryLabel === UNKNOWN) {
          labels[secondaryIndex] = MARKED;
          queue.push(secondaryNeighbor);
        } else if (secondaryLabel === NOISE) {
          queue.push(secondaryNeighbor);
        }
      }
    }
    return new MutableCluster<P>(label, points);
  }
}
