import { ColorSpace, AlphaChannel, ColorSpaceName, SupportedColor } from '../../types';

import { HSLColorSpace } from './hsl';
import { LabColorSpace } from './lab';
import { RGBColorSpace } from './rgb';
import { XYZColorSpace } from './xyz';

export { HSLColorSpace, clampH, clampL, clampS } from './hsl';
export { LabColorSpace } from './lab';
export { RGBColorSpace } from './rgb';
export { asPackedColor } from './utils';
export { XYZColorSpace } from './xyz';

/**
 * Find a color space by name.
 *
 * @param name The string representation of color space.
 * @return The color space corresponding to the name.
 * @throws {TypeError} if the name is unrecognized.
 */
export function colorSpace<T extends ColorSpaceName>(name: T): ColorSpace<SupportedColor[T]>;
export function colorSpace<T extends ColorSpaceName>(name: T): ColorSpace<AlphaChannel> {
  switch (name) {
    case 'hsl':
      return HSLColorSpace;
    case 'lab':
      return LabColorSpace;
    case 'rgb':
      return RGBColorSpace;
    case 'xyz':
      return XYZColorSpace;
    default:
      throw new TypeError(`Unrecognized name of color space: ${name}`);
  }
}
