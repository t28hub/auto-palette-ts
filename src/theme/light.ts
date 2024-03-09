import { Color } from '../color';
import { normalize } from '../math';
import type { Swatch } from '../swatch';
import { assertRange } from '../utils';
import type { ThemeStrategy } from './strategy';

const DEFAULT_MIN_LIGHTNESS = 50;

/**
 * The ThemeStrategy implementation for the light theme.
 */
export class LightThemeStrategy implements ThemeStrategy {
  /**
   * Create a new LightThemeStrategy instance.
   *
   * @param minLightness - The minimum lightness of the theme. The default value is 50.
   * @throws {AssertionError} If the minLightness is not in the range [0, 100].
   */
  constructor(private readonly minLightness: number = DEFAULT_MIN_LIGHTNESS) {
    assertRange(
      minLightness,
      Color.MIN_LIGHTNESS,
      Color.MAX_LIGHTNESS,
      `The minimum lightness must be in the range [${Color.MIN_LIGHTNESS}, ${Color.MAX_LIGHTNESS}]: ${minLightness}`,
    );
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const lightness = swatch.color.lightness();
    return lightness >= this.minLightness;
  }

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const lightness = swatch.color.lightness();
    return normalize(lightness, Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
  }
}
