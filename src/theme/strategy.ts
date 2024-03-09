import type { Swatch } from '../swatch';

/**
 * ThemeStrategy is a strategy to find the best swatch for a theme.
 */
export interface ThemeStrategy {
  /**
   * Filter the swatch for the theme.
   *
   * @param swatch - The swatch to filter.
   * @returns True if the swatch passes the filter, false otherwise.
   */
  filter(swatch: Swatch): boolean;

  /**
   * Calculate the normalized score of the swatch for the theme.
   *
   * @param swatch - The swatch to calculate the score for.
   * @returns The normalized score of the swatch for the theme.
   */
  score(swatch: Swatch): number;
}
