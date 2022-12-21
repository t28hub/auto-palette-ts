import { Color, DeltaE, DeltaEMeasure } from '../../types';

import { asDeltaE } from './utils';

/**
 * Compute the delta E76 between 2 colors.
 *
 * @param color1 The 1st color.
 * @param color2 The 2nd color.
 * @return The delta E76 between 2 colors.
 */
export const cie76: DeltaEMeasure = (color1: Color, color2: Color): DeltaE => {
  const lab1 = color1.convertTo('lab');
  const lab2 = color2.convertTo('lab');

  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  const distance = Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  return asDeltaE(distance);
};
