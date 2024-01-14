import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { assertRange } from '../utils';
import { ThemeStrategy } from './strategy';

const DEFAULT_MAX_LIGHTNESS = 50;

/**
 * The ThemeStrategy implementation for the dark theme.
 */
export class DarkThemeStrategy implements ThemeStrategy {
  /**
   * Create a new DarkThemeStrategy instance.
   *
   * @param maxLightness - The maximum lightness of the theme. The default value is 50.
   * @throws {AssertionError} If the maxLightness is not in the range [0, 100].
   */
  constructor(private readonly maxLightness: number = DEFAULT_MAX_LIGHTNESS) {
    assertRange(
      maxLightness,
      Color.MIN_LIGHTNESS,
      Color.MAX_LIGHTNESS,
      `The maximum lightness must be in the range [${Color.MIN_LIGHTNESS}, ${Color.MAX_LIGHTNESS}]: ${maxLightness}`,
    );
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const lightness = swatch.color.lightness();
    return lightness <= this.maxLightness;
  }

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const lightness = swatch.color.lightness();
    return 1 - normalize(lightness, Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
  }
}
