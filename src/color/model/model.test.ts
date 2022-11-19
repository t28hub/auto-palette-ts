import { asPackedColor } from './model';

describe('model', () => {
  describe('asPackedColor', () => {
    it.each([
      { value: 0x00000000 },
      { value: 0x00000001 },
      { value: 0x80808080 },
      { value: 0xfffffffe },
      { value: 0xffffffff },
    ])('should return valid packed color from $value', ({ value }) => {
      // Act
      const actual = asPackedColor(value);

      // Assert
      expect(actual).toEqual(value);
    });

    it.each([
      { value: -1 },
      { value: 1.05 },
      { value: 0x100000000 },
      { value: NaN },
      { value: Number.POSITIVE_INFINITY },
      { value: Number.NEGATIVE_INFINITY },
    ])('should throw TypeError if value is $value', ({ value }) => {
      // Assert
      expect(() => {
        // Act
        asPackedColor(value);
      }).toThrowError(TypeError);
    });
  });
});
