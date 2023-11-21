import { ArrayQueue } from '../../../utils';
import { DistanceFunction } from '../../distance';
import { KDTreeSearch, Neighbor, NeighborSearch } from '../../neighbors';
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
    const neighborSearch = KDTreeSearch.build(points, this.distanceFunction);
    const labels = new Array<Label>(points.length).fill(UNDEFINED);
    points.forEach((point: P, index: number) => {
      // Skip if the point has already been visited.
      if (labels[index] !== UNDEFINED) {
        return;
      }

      const neighbors = neighborSearch.searchRadius(point, this.radius);
      // Mark as noise point if there are not enough neighbors.
      if (neighbors.length < this.minPoints) {
        labels[index] = OUTLIER;
        return;
      }

      neighbors.forEach((neighbor: Neighbor<P>) => {
        const index = neighbor.index;
        labels[index] = MARKED;
      });
      this.expandCluster(label++, labels, neighbors, neighborSearch);
    });

    const clusters = new Map<Label, Cluster<P>>();
    labels.forEach((label: Label, index: number) => {
      if (label === OUTLIER) {
        return;
      }
      if (label === UNDEFINED || label === MARKED) {
        throw new Error(`The label(${label}) of point(${index}) is invalid`);
      }

      let cluster = clusters.get(label);
      if (!cluster) {
        cluster = new Cluster(new Vector(points[index]).setZero());
        clusters.set(label, cluster);
      }
      cluster.addMember(index, points[index]);
    });
    return Array.from(clusters.values());
  }

  /**
   * Expand the cluster and update the labels of the points.
   *
   * @private
   * @param label The label of the current cluster.
   * @param labels The labels of the points.
   * @param neighbors The neighbors of the current point.
   * @param neighborSearch The neighbor search instance.
   */
  private expandCluster(label: Label, labels: Label[], neighbors: Neighbor<P>[], neighborSearch: NeighborSearch<P>) {
    const queue = new ArrayQueue(...neighbors);
    while (!queue.isEmpty) {
      const neighbor = queue.pop();
      if (!neighbor) {
        continue;
      }

      // Skip if the point has already been assigned a label.
      if (labels[neighbor.index] > 0) {
        continue;
      }

      if (labels[neighbor.index] === OUTLIER) {
        labels[neighbor.index] = label;
        continue;
      }

      labels[neighbor.index] = label;

      const secondaryNeighbors = neighborSearch.searchRadius(neighbor.point, this.radius);
      if (secondaryNeighbors.length < this.minPoints) {
        continue;
      }

      secondaryNeighbors.forEach((secondaryNeighbor: Neighbor<P>) => {
        const secondaryIndex = secondaryNeighbor.index;
        const secondaryLabel = labels[secondaryIndex];
        if (secondaryLabel === UNDEFINED) {
          labels[secondaryIndex] = MARKED;
          queue.push(secondaryNeighbor);
        } else if (secondaryLabel === OUTLIER) {
          queue.push(secondaryNeighbor);
        }
      });
    }
  }
}
