import { HSL, type HSLColor } from './hsl';
import { type Model, type Opacity } from './model';
import { RGB, type RGBColor } from './rgb';

export { type HSLColor } from './hsl';
export { asPackedColor, type Model, type Opacity } from './model';
export { type RGBColor } from './rgb';

/**
 * Interface representing supported color models.
 */
export interface SupportedModel {
  readonly hsl: Model<HSLColor>;
  readonly rgb: Model<RGBColor>;
}

/**
 * String representation of supported color models.
 */
export type ColorModel = keyof SupportedModel;

/**
 * Find color model by name.
 *
 * @param name The string representation of color model.
 * @return The color model corresponding to the name.
 * @throws {TypeError} if the name is unrecognized.
 */
export function colorModel<T extends ColorModel>(name: T): SupportedModel[T];
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
