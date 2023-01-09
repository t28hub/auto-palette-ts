import { Swatch } from '../../types';

import { FilterFunction } from './types';

const NO_INDEX = -1;

function findBestIndex(swatches: Swatch[], selected: Map<number, Swatch>): number {
  let bestIndex = NO_INDEX;
  let maxDistance = Number.MIN_VALUE;
  for (let i = 0; i < swatches.length; i++) {
    if (selected.has(i)) {
      continue;
    }

    const candidate = swatches[i];
    const totalDistance = Array.from(selected.values()).reduce((previous: number, swatch: Swatch): number => {
      const distance = candidate.color.difference(swatch.color);
      return previous + distance;
    }, 0.0);

    if (maxDistance < totalDistance) {
      bestIndex = i;
      maxDistance = totalDistance;
    }
  }
  return bestIndex;
}

export function swatchFilter(): FilterFunction {
  return {
    apply(swatches: Swatch[], size: number): Swatch[] {
      if (size < 1) {
        throw new RangeError(`The given size(${size}) is negative number`);
      }

      if (swatches.length <= size) {
        return swatches;
      }

      // Sort by population in descending order.
      swatches.sort((swatch1: Swatch, swatch2: Swatch): number => {
        return swatch2.population - swatch1.population;
      });

      const selected = new Map<number, Swatch>();
      selected.set(0, swatches[0]); // Set index of dominant swatch as the initial value;
      while (selected.size < size) {
        const bestIndex = findBestIndex(swatches, selected);
        if (bestIndex < 0) {
          break;
        }
        selected.set(bestIndex, swatches[bestIndex]);
      }
      return Array.from(selected.values());
    },
  };
}
