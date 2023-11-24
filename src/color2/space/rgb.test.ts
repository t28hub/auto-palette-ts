import { describe, expect, it } from 'vitest';

import { RGBSpace } from './rgb';

describe('RGBSpace', () => {
  describe('clampValue', () => {
    it.each([
      { value: -1, expected: 0 },
      { value: 0, expected: 0 },
      { value: 128, expected: 128 },
      { value: 255, expected: 255 },
      { value: 256, expected: 255 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = RGBSpace.clampValue(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
