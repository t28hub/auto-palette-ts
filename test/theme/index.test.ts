import { Theme, defaultThemeStrategy, getThemeStrategy } from '@internal/theme';
import { DarkThemeStrategy } from '@internal/theme/dark';
import { DefaultThemeStrategy } from '@internal/theme/default';
import { LightThemeStrategy } from '@internal/theme/light';
import { MutedThemeStrategy } from '@internal/theme/muted';
import { VividThemeStrategy } from '@internal/theme/vivid';
import { describe, expect, it } from 'vitest';

describe('Theme', () => {
  describe('getThemeStrategy', () => {
    it.each([
      { theme: 'vivid', expected: VividThemeStrategy },
      { theme: 'muted', expected: MutedThemeStrategy },
      { theme: 'light', expected: LightThemeStrategy },
      { theme: 'dark', expected: DarkThemeStrategy },
    ])('should return the ThemeStrategy for the $theme', ({ theme, expected }) => {
      // Act
      const themeStrategy = getThemeStrategy(theme as Theme);

      // Assert
      expect(themeStrategy).toBeDefined();
      expect(themeStrategy).toEqual(expected);
    });
  });

  describe('defaultThemeStrategy', () => {
    it('should return the default theme strategy', () => {
      // Act
      const themeStrategy = defaultThemeStrategy(384);

      // Assert
      expect(themeStrategy).toBeDefined();
      expect(themeStrategy).toBeInstanceOf(DefaultThemeStrategy);
    });
  });
});
