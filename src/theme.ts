import { Color } from './color';
import { normalize } from './math';
import { Swatch } from './swatch';

/**
 * Theme type represents a color theme.
 * - vivid: The theme with vivid colors.
 * - muted: The theme with muted colors.
 * - light: The theme with light colors.
 * - dark: The theme with dark colors.
 */
export type Theme = 'vivid' | 'muted' | 'light' | 'dark';

/**
 * WeightFunction calculates the weight of a swatch.
 *
 * @param swatch - The swatch to calculate the weight for.
 * @returns The weight of the swatch. The weight should be a number between 0 and 1.
 */
export type WeightFunction = (swatch: Swatch) => number;

/**
 * The implementations of WeightFunction for each theme.
 */
const implementations: Record<Theme, WeightFunction> = {
  vivid: (swatch): number => {
    const chroma = swatch.color.chroma();
    return normalize(chroma, Color.MIN_CHROMA, Color.MAX_CHROMA);
  },
  muted: (swatch): number => {
    const chroma = swatch.color.chroma();
    return 1.0 - normalize(chroma, Color.MIN_CHROMA, Color.MAX_CHROMA);
  },
  light: (swatch): number => {
    const lightness = swatch.color.lightness();
    return normalize(lightness, Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
  },
  dark: (swatch): number => {
    const lightness = swatch.color.lightness();
    return 1.0 - normalize(lightness, Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
  },
};

/**
 * Return the WeightFunction for the theme.
 *
 * @param theme - The theme to get the WeightFunction for.
 * @returns The WeightFunction for the theme.
 */
export function getWeightFunction(theme: Theme): WeightFunction {
  return implementations[theme];
}
