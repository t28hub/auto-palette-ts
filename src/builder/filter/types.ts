import { Swatch } from '../../types';

export interface FilterFunction {
  apply(swatches: Swatch[], size: number): Swatch[];
}
