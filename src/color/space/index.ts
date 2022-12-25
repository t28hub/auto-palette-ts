import { ColorSpace, RGB, HSL, Lab, XYZ } from '../../types';

import { HSLColorSpace } from './hsl';
import { LabColorSpace } from './lab';
import { RGBColorSpace } from './rgb';
import { XYZColorSpace } from './xyz';

export { clampH, clampL, clampS } from './hsl';
export { asPackedColor } from './utils';

export function hsl(): ColorSpace<HSL> {
  return HSLColorSpace;
}

export function lab(): ColorSpace<Lab> {
  return LabColorSpace;
}

export function rgb(): ColorSpace<RGB> {
  return RGBColorSpace;
}

export function xyz(): ColorSpace<XYZ> {
  return XYZColorSpace;
}
