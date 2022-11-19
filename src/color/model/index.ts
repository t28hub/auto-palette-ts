import { HSL, type HSLColor } from './hsl';
import { type Model, type Opacity } from './model';
import { RGB, type RGBColor } from './rgb';

export { HSL, type HSLColor, normalizeH, normalizeL, normalizeS } from './hsl';
export { asPackedColor, type Model, type Opacity, type PackedColor } from './model';
export { RGB, type RGBColor } from './rgb';

/**
 * Interface representing supported colors.
 */
export interface SupportedColor {
  readonly hsl: HSLColor;
  readonly rgb: RGBColor;
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
    case 'rgb':
      return RGB;
    default:
      throw new TypeError(`Unrecognized name of color model: ${name}`);
  }
}
