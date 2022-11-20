import { HSL, type HSLColor } from './hsl';
import { Lab, LabColor } from './lab';
import { type Model, type Opacity } from './model';
import { RGB, type RGBColor } from './rgb';
import { XYZ, XYZColor } from './xyz';

export { HSL, type HSLColor, normalizeH, normalizeL, normalizeS } from './hsl';
export { Lab, type LabColor } from './lab';
export { asPackedColor, type Model, type Opacity, type PackedColor } from './model';
export { RGB, type RGBColor } from './rgb';
export { XYZ, type XYZColor } from './xyz';

/**
 * Interface representing supported colors.
 */
export interface SupportedColor {
  readonly hsl: HSLColor;
  readonly lab: LabColor;
  readonly rgb: RGBColor;
  readonly xyz: XYZColor;
}

/**
 * String representation of supported color models.
 */
export type ColorModel = keyof SupportedColor;

/**
 * Find color model by name.
 *
 * @param name The string representation of color model.
 * @return The color model corresponding to the name.
 * @throws {TypeError} if the name is unrecognized.
 */
export function colorModel<T extends ColorModel>(name: T): Model<SupportedColor[T]>;
export function colorModel<T extends ColorModel>(name: T): Model<Opacity> {
  switch (name) {
    case 'hsl':
      return HSL;
    case 'lab':
      return Lab;
    case 'rgb':
      return RGB;
    case 'xyz':
      return XYZ;
    default:
      throw new TypeError(`Unrecognized name of color model: ${name}`);
  }
}
