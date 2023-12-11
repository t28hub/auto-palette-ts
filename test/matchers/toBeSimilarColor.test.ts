import { describe, expect, it } from 'vitest';

import { Color } from '../../src';

describe('.toBeSimilarColor', () => {
  it('should pass when the expected color is same as the received color', () => {
    // Act
    const actual = Color.fromString('#FF0000');
    expect(actual).toBeSimilarColor('#FF0000');
  });

  it('should pass when the expected color is similar to the received color', () => {
    // Act
    const actual = Color.fromString('#FF0000');
    expect(actual).toBeSimilarColor('#FF0020');
  });

  it('should pass when the color difference is less than the given threshold', () => {
    // Act
    const actual = Color.fromString('#FF0000');
    expect(actual).toBeSimilarColor('#FF0020', 50.0);
  });

  it('should throw an Error when the color difference is greater than the given threshold', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.fromString('#FF0000');
      expect(actual).toBeSimilarColor('#0000FF', 5.0);
    }).toThrowError(/Expected color to be similar:/);
  });

  it('should throw an Error when the expected color is not similar to the received color', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.fromString('#FF0000');
      expect(actual).toBeSimilarColor('#0000FF');
    }).toThrow(/Expected color to be similar:/);
  });

  it('should throw Error when expected color is not parseable', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.fromString('#FF0000');
      expect(actual).toBeSimilarColor('invalid');
    }).toThrowError('The value(invalid) is not a valid hexadecimal color string');
  });
});

describe('.not.toBeSimilarColor', () => {
  it('should pass when expected color is not similar to the received color', () => {
    // Act
    const actual = Color.fromString('#FF0000');
    expect(actual).not.toBeSimilarColor('#0000FF');
  });

  it('should pass when the color difference is greater than the given threshold', () => {
    // Act
    const actual = Color.fromString('#FF0000');
    expect(actual).not.toBeSimilarColor('#0000FF', 5.0);
  });

  it('should throw an Error when the color difference is less than the given threshold', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.fromString('#FF0000');
      expect(actual).not.toBeSimilarColor('#FF0020', 50.0);
    }).toThrowError(/Expected color to not be similar:/);
  });

  it('should throw an Error when the expected color is similar to the received color', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.fromString('#FF0000');
      expect(actual).not.toBeSimilarColor('#FF0020');
    }).toThrowError(/Expected color to not be similar:/);
  });

  it('should throw an Error when the expected color valid is not parseable', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.fromString('#FF0000');
      expect(actual).toBeSimilarColor('invalid');
    }).toThrowError('The value(invalid) is not a valid hexadecimal color string');
  });
});
