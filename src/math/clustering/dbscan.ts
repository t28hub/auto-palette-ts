import { ArrayQueue } from '../../collection';
import { Cluster, ClusteringAlgorithm, NearestNeighborSearch, Neighbor, Point } from '../types';

import { DBSCANCluster } from './dbscanCluster';

type Label = number;

const NOISE: Label = -1;
const MARKED: Label = -2;
const UNKNOWN: Label = -3;

/**
 * Density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [Wikipedia - DBSCAN](https://en.wikipedia.org/wiki/DBSCAN)
 */
export class DBSCAN<P extends Point> implements ClusteringAlgorithm<P> {
  /**
   * Create a new DBSCAN.
   *
   * @param minPoints The minimum size of cluster.
   * @param radius The neighbor radius.
   * @param nns The Nearest neighbor search algorithm.
   * @throws {RangeError} if the given minPoint is less than 1.
   * @throws {RangeError} if the given radius is less than 0.0.
   */
  constructor(
    private readonly minPoints: number,
    private readonly radius: number,
    private readonly nns: NearestNeighborSearch<P>,
  ) {
    if (minPoints < 1) {
      throw new RangeError(`The minimum size of cluster(${minPoints}) is not greater than or equal to 1`);
    }
    if (radius < 0.0) {
      throw new RangeError(`The radius(${radius}) is not greater than 0.0`);
    }
  }

  fit(points: P[]): Cluster<P>[] {
    let label: Label = 0;
    const labels = new Array<Label>(points.length).fill(UNKNOWN);
    const clusters = new Map<Label, Cluster<P>>();
    points.forEach((point: P, index: number) => {
      // Skip visited point.
      if (labels[index] !== UNKNOWN) {
        return;
      }

      const neighbors = this.nns.search(point, this.radius);
      // Mark as noise point
      if (neighbors.length < this.minPoints) {
        labels[index] = NOISE;
        return;
      }

      labels[index] = label;

      const cluster = this.buildCluster(neighbors, labels, label);
      cluster.append(point);
      clusters.set(label++, cluster);
    });
    return Array.from(clusters.values());
  }

  private buildCluster(neighbors: Neighbor<P>[], labels: Label[], label: Label): DBSCANCluster<P> {
    neighbors.forEach((neighbor: Neighbor<P>) => {
      const index = neighbor.index;
      if (labels[index] === UNKNOWN) {
        labels[index] = MARKED;
      }
    });

    const queue = new ArrayQueue(...neighbors);
    const points = new Set<P>();
    while (!queue.isEmpty) {
      const neighbor = queue.dequeue();
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

      const secondaryNeighbors = this.nns.search(neighbor.point, this.radius);
      if (secondaryNeighbors.length < this.minPoints) {
        continue;
      }

      for (const secondaryNeighbor of secondaryNeighbors) {
        const secondaryIndex = secondaryNeighbor.index;
        const secondaryLabel = labels[secondaryIndex];
        if (secondaryLabel === UNKNOWN) {
          labels[secondaryIndex] = MARKED;
          queue.enqueue(secondaryNeighbor);
        } else if (secondaryLabel === NOISE) {
          queue.enqueue(secondaryNeighbor);
        }
      }
    }
    return new DBSCANCluster<P>(points);
  }
}
