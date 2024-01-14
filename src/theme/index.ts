import { ThemeStrategy } from './strategy';
import { ThemeVisitor } from './visitor';

/**
 * Theme type represents a color theme.
 * - basic: The theme with basic colors.
 * - vivid: The theme with vivid colors.
 * - muted: The theme with muted colors.
 * - light: The theme with light colors.
 * - dark: The theme with dark colors.
 */
export type Theme = 'basic' | 'vivid' | 'muted' | 'light' | 'dark';

export type { ThemeStrategy, ThemeVisitor };

export { BasicThemeStrategy } from './basic';
export { DarkThemeStrategy } from './dark';
export { LightThemeStrategy } from './light';
export { MutedThemeStrategy } from './muted';
export { VividThemeStrategy } from './vivid';

const visitors: Record<Theme, <P, R>(visitor: ThemeVisitor<P, R>, parameters: P) => R> = {
  basic: (visitor, parameters) => visitor.visitBasic(parameters),
  vivid: (visitor, parameters) => visitor.visitVivid(parameters),
  muted: (visitor, parameters) => visitor.visitMuted(parameters),
  light: (visitor, parameters) => visitor.visitLight(parameters),
  dark: (visitor, parameters) => visitor.visitDark(parameters),
} as const;

/**
 * Visit the theme with the visitor.
 *
 * @param theme - The theme to visit.
 * @param visitor - The visitor to visit the theme.
 * @param parameters - The parameters to visit the theme.
 * @returns The result of the visitor.
 */
export function visit<P, R>(theme: Theme, visitor: ThemeVisitor<P, R>, parameters: P): R {
  return visitors[theme](visitor, parameters);
}
