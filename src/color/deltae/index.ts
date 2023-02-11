import { DeltaEFunction } from '../../types';

import { CIEDE2000 } from './ciede2000';

/**
 * Create a new CIEDE 2000 color difference formula.
 *
 * @param kL The kL value.
 * @param kC The kC value.
 * @param kH The kH value.
 * @return CIEDE 2000 color difference formula.
 */
export function ciede2000(kL = 1.0, kC = 1.0, kH = 1.0): DeltaEFunction {
  return new CIEDE2000(kL, kC, kH);
}
