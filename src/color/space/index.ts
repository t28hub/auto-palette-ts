import { ColorSpace, RGB, HSL, Lab, XYZ } from '../../types';

import { HSLColorSpace } from './hsl';
import { LabColorSpace } from './lab';
import { RGBColorSpace } from './rgb';
import { D65, WhitePoint, XYZColorSpace } from './xyz';

export { asPackedColor } from './utils';

/**
 * Create a new HSL color space.
 *
 * @return The HSL color space.
 */
export function hsl(): ColorSpace<HSL> {
  return new HSLColorSpace(rgb());
}

/**
 * Create a new CIE L*a*b* color space.
 *
 * @param whitePoint The white point.
 * @return The CIE L*a*b* color space.
 */
export function lab(whitePoint: WhitePoint = D65): ColorSpace<Lab> {
  return new LabColorSpace(whitePoint);
}

/**
 * Create a new RGB color space.
 *
 * @return The RGB color space.
 */
export function rgb(): ColorSpace<RGB> {
  return new RGBColorSpace();
}

/**
 * Create a new CIE XYZ color space.
 *
 * @return The CIE XYZ color space.
 */
export function xyz(): ColorSpace<XYZ> {
  return new XYZColorSpace(rgb());
}
