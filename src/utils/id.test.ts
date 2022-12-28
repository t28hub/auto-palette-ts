import { describe, expect, it } from 'vitest';

import { asID, id, isID } from './id';

describe('id', () => {
  describe('isID', () => {
    it.each([
      { value: '00000000', expected: true },
      { value: '1882d243', expected: true },
      { value: 'ffffffff', expected: true },
      { value: 0, expected: false },
      { value: '', expected: false },
      { value: '1882d24', expected: false },
      { value: '1882d24g', expected: false },
      { value: '1882d243c', expected: false },
    ])('should return $expected when value === $value', ({ value, expected }) => {
      // Act
      const actual = isID(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('asID', () => {
    it('should return the valid ID', () => {
      // Act
      const actual = asID('e015cb94');

      // Assert
      expect(actual).toEqual('e015cb94');
    });

    it('should throw TypeError when the value is not valid ID', () => {
      // Assert
      expect(() => {
        // Act
        asID('e015cb9g');
      }).toThrowError(TypeError);
    });
  });

  describe('id', () => {
    it('should generate a new unique ID', () => {
      // Act
      const actual = id();

      // Assert
      expect(actual).toMatch(/^[0-9a-f]{8}$/);
    });
  });
});
