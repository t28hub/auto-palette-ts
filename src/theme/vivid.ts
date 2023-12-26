import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { ThemeStrategy } from './strategy';

const MIN_CHROMA = 40;

/**
 * The vivid theme strategy.
 */
export const VividThemeStrategy: ThemeStrategy = {
  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const chroma = swatch.color.chroma();
    return chroma >= MIN_CHROMA;
  },
  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const chroma = swatch.color.chroma();
    return normalize(chroma, Color.MIN_CHROMA, Color.MAX_CHROMA);
  },
};
