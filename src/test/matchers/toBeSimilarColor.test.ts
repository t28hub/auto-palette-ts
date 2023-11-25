import { describe, expect, it } from 'vitest';

import { Color } from '../../color';

describe('.toBeSimilarColor', () => {
  it('should pass when expected color is same color', () => {
    // Act
    const actual = Color.parse('#ff0000');
    expect(actual).toBeSimilarColor('#ff0000');
  });

  it('should pass when expected color is similar color', () => {
    // Act
    const actual = Color.parse('#ff0000');
    expect(actual).toBeSimilarColor('#ff0020');
  });

  it('should throw Error when expected color is not similar color', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.parse('#ff0000');
      expect(actual).toBeSimilarColor('#0000ff');
    }).toThrow(/a/);
  });

  it('should throw Error when expected valid is not parseable', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.parse('#ff0000');
      expect(actual).toBeSimilarColor(null);
    }).toThrowError();
  });
});

describe('.not.toBeSimilarColor', () => {
  it('should pass when expected color is not similar color', () => {
    // Act
    const actual = Color.parse('#ff0000');
    expect(actual).not.toBeSimilarColor('#0000ff');
  });

  it('should throw Error when expected color is similar color', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.parse('#ff0000');
      expect(actual).not.toBeSimilarColor('#ff0020');
    }).toThrowError();
  });

  it('should throw Error when expected valid is not parseable', () => {
    // Assert
    expect(() => {
      // Act
      const actual = Color.parse('#ff0000');
      expect(actual).toBeSimilarColor(null);
    }).toThrowError();
  });
});
