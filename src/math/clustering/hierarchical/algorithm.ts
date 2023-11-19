import { Ordering, PriorityQueue } from '../../../utils';
import { Distance } from '../../distance';

import { Dendrogram, Step } from './dendrogram';
import { DistanceMatrix } from './matrix';

/**
 * Type of the step of the dendrogram.
 */
type Pair = {
  // The index of the 1st child step.
  readonly i: number;
  // The index of the 2nd child step.
  readonly j: number;
  // The distance between the 1st child step and the 2nd child step.
  readonly distance: number;
};

export class HierarchicalClustering<T> {
  constructor(private readonly distanceFunction: (a: T, b: T) => Distance) {}

  fit(data: T[]): Dendrogram {
    const dataSize = data.length;
    if (dataSize <= 1) {
      throw new Error(`The size of the data(${dataSize}) is less than 2.`);
    }

    const queue = new PriorityQueue<Pair>((pair1, pair2): Ordering => {
      if (pair1.distance < pair2.distance) {
        return -1;
      }
      if (pair1.distance > pair2.distance) {
        return 1;
      }
      return 0;
    });
    const matrix = new DistanceMatrix(dataSize * 2 - 1);
    const dendrogram = new Dendrogram(dataSize * 2 - 1);

    // Initialize the distance matrix and the dendrogram.
    for (let i = 0; i < dataSize; i++) {
      for (let j = i + 1; j < dataSize; j++) {
        const distance = this.distanceFunction(data[i], data[j]);
        matrix.set(i, j, distance);
        queue.push({ i, j, distance });
      }
      dendrogram.push({ label: i, size: 1, distance: Number.POSITIVE_INFINITY, childIndex1: -1, childIndex2: -1 });
    }

    let nextLabel = dataSize;
    const inactivated = new Set<number>();
    while (!queue.isEmpty) {
      const nearestPair = queue.pop();
      if (!nearestPair) {
        break;
      }

      const { i, j, distance } = nearestPair;
      if (inactivated.has(i) || inactivated.has(j)) {
        continue;
      }

      const step1 = dendrogram.stepAt(i);
      const step2 = dendrogram.stepAt(j);
      if (!step1 || !step2) {
        continue;
      }

      const size1 = step1.size;
      const size2 = step2.size;

      const label = nextLabel++;
      const merged: Step = {
        label,
        childIndex1: i,
        childIndex2: j,
        distance,
        size: size1 + size2,
      };
      dendrogram.push(merged);

      inactivated.add(i);
      inactivated.add(j);

      dendrogram.forEach((step) => {
        if (inactivated.has(step.label) || step.label === label) {
          return;
        }

        const distance1 = matrix.get(i, step.label);
        const distance2 = matrix.get(j, step.label);

        // Single linkage
        const distance = Math.min(distance1, distance2);
        matrix.set(label, step.label, distance);
        queue.push({ i: label, j: step.label, distance });

        // Inactive the old distance
        matrix.set(label, i, Number.POSITIVE_INFINITY);
        matrix.set(label, j, Number.POSITIVE_INFINITY);
      });
    }
    return dendrogram;
  }
}
