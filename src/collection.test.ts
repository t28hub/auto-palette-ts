import { describe, expect, it } from 'vitest';

import { SwatchCollection } from './collection';
import { Color } from './color';
import { Swatch } from './swatch';

const swatches: Swatch[] = [
  {
    color: Color.parse('#11457E'),
    population: 64,
    position: { x: 45, y: 30 },
  },
  {
    color: Color.parse('#FFFFFF'),
    population: 128,
    position: { x: 18, y: 72 },
  },
  {
    color: Color.parse('#D7141A'),
    population: 48,
    position: { x: 9, y: 54 },
  },
];

describe('SwatchCollection', () => {
  describe('constructor', () => {
    it('should create a new SwatchCollection instance', () => {
      // Act
      const actual = new SwatchCollection(swatches);

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size()).toBe(3);
      expect(actual.isEmpty()).toBeFalsy();
    });
  });

  describe('size', () => {
    it('should return the size of the collection', () => {
      // Act
      const collection = new SwatchCollection(swatches);
      const actual = collection.size();

      // Assert
      expect(actual).toBe(3);
    });
  });

  describe('isEmpty', () => {
    it('should return true if the collection is empty', () => {
      // Act
      const collection = new SwatchCollection([]);
      const actual = collection.isEmpty();

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false if the collection is not empty', () => {
      // Act
      const collection = new SwatchCollection(swatches);
      const actual = collection.isEmpty();

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('at', () => {
    it('should return the swatch at the specified index', () => {
      // Act
      const collection = new SwatchCollection(swatches);
      const actual = collection.at(1);

      // Assert
      expect(actual).toEqual(swatches[0]);
    });

    it('should throw a TypeError if the index is not an integer', () => {
      // Arrange
      const collection = new SwatchCollection(swatches);

      // Assert
      expect(() => {
        // Act
        collection.at(Infinity);
      }).toThrowError(TypeError);
    });

    it.each([-1, 3])('should throw a RangeError if the index(%d) is out of range', (index) => {
      // Arrange
      const collection = new SwatchCollection(swatches);

      // Assert
      expect(() => {
        // Act
        collection.at(index);
      }).toThrowError(RangeError);
    });
  });

  describe('find', () => {
    it('should return the best swatches in the collection', () => {
      // Act
      const collection = new SwatchCollection(swatches);
      const actual = collection.find(2);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual).toContainAnyValues(swatches);
    });

    it('should throw a TypeError if the number of swatches to find is not an integer', () => {
      // Arrange
      const collection = new SwatchCollection(swatches);

      // Assert
      expect(() => {
        // Act
        collection.find(Infinity);
      }).toThrowError(TypeError);
    });

    it.each([-1, 0, 4])('should throw a RangeError if the number of swatches(%d) to find is out of range', (n) => {
      // Arrange
      const collection = new SwatchCollection(swatches);

      // Assert
      expect(() => {
        // Act
        collection.find(n);
      }).toThrowError(RangeError);
    });
  });
});
