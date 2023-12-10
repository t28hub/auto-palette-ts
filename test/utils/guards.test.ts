import { isNumber, isString } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('guards', () => {
  describe('isNumber', () => {
    it('should return true if the value is a number', () => {
      // Act
      const actual = isNumber(1);

      // Assert
      expect(actual).toBeTruthy();
    });

    it.each([undefined, null, '1', true, {}, [], () => {}, Symbol('1')])(
      'should return false if the value(%s) is not a number',
      (value) => {
        // Act
        const actual = isNumber(value);

        // Assert
        expect(actual).toBeFalsy();
      },
    );
  });

  describe('isString', () => {
    it('should return true if the value is a string', () => {
      // Act
      const actual = isString('1');

      // Assert
      expect(actual).toBeTruthy();
    });

    it.each([undefined, null, 1, true, {}, [], () => {}, Symbol('1')])(
      'should return false if the value(%s) is not a string',
      (value) => {
        // Act
        const actual = isString(value);

        // Assert
        expect(actual).toBeFalsy();
      },
    );
  });
});
