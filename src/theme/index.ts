import { DarkThemeStrategy } from './dark';
import { DefaultThemeStrategy } from './default';
import { LightThemeStrategy } from './light';
import { MutedThemeStrategy } from './muted';
import { ThemeStrategy } from './strategy';
import { VividThemeStrategy } from './vivid';

/**
 * Theme type represents a color theme.
 * - vivid: The theme with vivid colors.
 * - muted: The theme with muted colors.
 * - light: The theme with light colors.
 * - dark: The theme with dark colors.
 */
export type Theme = 'vivid' | 'muted' | 'light' | 'dark';

export type { ThemeStrategy };

const implementations: Record<Theme, ThemeStrategy> = {
  vivid: VividThemeStrategy,
  muted: MutedThemeStrategy,
  light: LightThemeStrategy,
  dark: DarkThemeStrategy,
} as const;

/**
 * Get the theme strategy.
 *
 * @param theme - The theme.
 * @return The theme strategy for the theme.
 */
export function getThemeStrategy(theme: Theme): ThemeStrategy {
  return implementations[theme];
}

/**
 * Create a default theme strategy.
 *
 * @param maxPopulation - The maximum population of the palette.
 * @return The default theme strategy.
 */
export function defaultThemeStrategy(maxPopulation: number): ThemeStrategy {
  return new DefaultThemeStrategy(maxPopulation);
}
