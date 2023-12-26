import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { ThemeStrategy } from './strategy';

/**
 * The light theme strategy.
 */
export const LightThemeStrategy: ThemeStrategy = {
  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    return swatch.color.isLight();
  },
  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const lightness = swatch.color.lightness();
    return normalize(lightness, Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
  },
};
