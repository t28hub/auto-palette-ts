import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { ThemeStrategy } from './strategy';

const MAX_CHROMA = 40;

/**
 * The muted theme strategy.
 */
export const MutedThemeStrategy: ThemeStrategy = {
  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const chroma = swatch.color.chroma();
    return chroma < MAX_CHROMA;
  },
  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const chroma = swatch.color.chroma();
    return 1.0 - normalize(chroma, Color.MIN_CHROMA, Color.MAX_CHROMA);
  },
};
