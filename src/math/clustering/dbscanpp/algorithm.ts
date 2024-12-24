import { assert, ArrayQueue } from '../../../utils';
import type { DistanceMeasure } from '../../distance';
import { KDTreeSearch, type Neighbor } from '../../neighbor';
import type { Point } from '../../point';
import { Vector } from '../../vector';
import type { ClusteringAlgorithm } from '../algorithm';
import { Cluster } from '../cluster';

type Label = number;

const OUTLIER: Label = -1;
const MARKED: Label = -2;
const UNDEFINED: Label = -3;

/**
 * Implementation of the DBSCAN++ algorithm that is an extension of the DBSCAN algorithm.
 *
 * @template P The type of points to be clustered, extending the `Point` interface.
 * @implements {ClusteringAlgorithm<P>}
 * @see {@link DBSCAN}
 */
export class DBSCANpp<P extends Point> implements ClusteringAlgorithm<P> {
  /**
   * Create a new DBSCANpp instance.
   *
   * @param probability - The probability of selecting a point as a core point.
   * @param minPoints - The minimum number of points required to form a cluster.
   * @param epsilon - The radius within which to search for neighboring points.
   * @param distanceMeasure - The function to measure the distance between two points.
   */
  constructor(
    readonly probability: number,
    readonly minPoints: number,
    readonly epsilon: number,
    readonly distanceMeasure: DistanceMeasure,
  ) {
    assert(
      this.probability > 0 && this.probability <= 1,
      `The probability(${this.probability}) is not in the range (0, 1]`,
    );
    assert(this.minPoints >= 1, `The minimum size of cluster(${this.minPoints}) is not greater than or equal to 1`);
    assert(this.epsilon >= 0.0, `The epsilon(${this.epsilon}) is not greater than 0.0`);
  }

  /**
   * {@inheritDoc ClusteringAlgorithm.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      return [];
    }

    const pointsSearch = KDTreeSearch.build(points, 16, this.distanceMeasure);
    const corePoints = this.findCorePoints(points, pointsSearch);
    const corePointsSearch = KDTreeSearch.build(corePoints, 16, this.distanceMeasure);
    const coreLabels = this.labelCorePoints(corePoints, corePointsSearch);
    return this.assignClusters(points, coreLabels, corePointsSearch);
  }

  private findCorePoints(points: P[], neighborSearch: KDTreeSearch<P>): P[] {
    const step = Math.round(1 / this.probability);
    const corePoints = new Array<P>();
    for (let i = 0; i < points.length; i += step) {
      const point = points[i];
      const neighbors = neighborSearch.searchRadius(point, this.epsilon);
      if (neighbors.length >= this.minPoints) {
        corePoints.push(point);
      }
    }
    return corePoints;
  }

  private labelCorePoints(corePoints: P[], corePointsSearch: KDTreeSearch<P>): Label[] {
    let label: Label = 0;
    const labels = new Array<Label>(corePoints.length).fill(UNDEFINED);
    for (let i = 0; i < corePoints.length; i++) {
      if (labels[i] !== UNDEFINED) {
        continue;
      }

      const point = corePoints[i];
      const neighbors = corePointsSearch.searchRadius(point, this.epsilon);
      if (neighbors.length < this.minPoints) {
        labels[i] = OUTLIER;
        continue;
      }

      for (const neighbor of neighbors) {
        if (labels[neighbor.index] !== UNDEFINED) {
          continue;
        }
        labels[neighbor.index] = MARKED;
      }

      this.expandCluster(label, labels, corePoints, neighbors, corePointsSearch);
      label++;
    }
    return labels;
  }

  private expandCluster(
    label: Label,
    labels: Label[],
    points: P[],
    neighbors: Neighbor[],
    neighborSearch: KDTreeSearch<P>,
  ) {
    const queue = new ArrayQueue(...neighbors);
    while (!queue.isEmpty()) {
      const neighbor = queue.pop();
      if (!neighbor) {
        continue;
      }

      const neighborIndex = neighbor.index;
      const neighborPoint = points[neighborIndex];

      // Skip if the point has already been assigned a label.
      if (labels[neighborIndex] > 0) {
        continue;
      }

      if (labels[neighborIndex] === OUTLIER) {
        labels[neighborIndex] = label;
        continue;
      }

      labels[neighborIndex] = label;

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
  }

  private assignClusters(points: P[], coreLabels: Label[], corePointsSearch: KDTreeSearch<P>): Cluster<P>[] {
    const clusters = new Map<Label, Cluster<P>>();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const nearest = corePointsSearch.searchNearest(point);
      if (nearest.distance > this.epsilon) {
        continue;
      }

      const coreLabel = coreLabels[nearest.index];
      if (coreLabel < 0) {
        continue;
      }

      const cluster = clusters.get(coreLabel);
      if (cluster) {
        cluster.addMember(i, point);
      } else {
        const centroid = new Vector(point).setZero();
        const newCluster = new Cluster<P>(centroid);
        newCluster.addMember(i, point);
        clusters.set(coreLabel, newCluster);
      }
    }
    return Array.from(clusters.values());
  }
}
