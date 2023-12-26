import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { ThemeStrategy } from './strategy';

/**
 * The dark theme strategy.
 */
export const DarkThemeStrategy: ThemeStrategy = {
  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    return swatch.color.isDark();
  },

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const lightness = swatch.color.lightness();
    return 1 - normalize(lightness, Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
  },
};
