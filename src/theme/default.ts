import { normalize } from '../math';
import { Swatch } from '../swatch';
import { assertPositiveInteger } from '../utils';
import { ThemeStrategy } from './strategy';

/**
 * The population-based default theme strategy.
 */
export class DefaultThemeStrategy implements ThemeStrategy {
  /**
   * Create a new DefaultThemeStrategy instance.
   *
   * @param maxPopulation - The maximum population of the palette.
   * @throws {TypeError} If the maximum population is not a positive integer.
   */
  constructor(private readonly maxPopulation: number) {
    assertPositiveInteger(maxPopulation, `The maximum population must be a positive integer: ${maxPopulation}`);
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(_swatch: Swatch): boolean {
    return true;
  }

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    return normalize(swatch.population, 0, this.maxPopulation);
  }
}
