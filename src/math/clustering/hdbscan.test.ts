import { beforeEach, describe, it } from 'vitest';

import { Point2 } from '../types';

import { HDBSCAN } from './hdbscan';

describe('HDBSCAN', () => {
  describe('constructor', () => {
    it('should create a HDBSCAN', () => {
      // Act
      const actual = new HDBSCAN();

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('fit', () => {
    let hdbscan: HDBSCAN<Point2>;
    beforeEach(() => {
      hdbscan = new HDBSCAN<Point2>();
    });

    it('should return an empty clusters if the given points is empty', () => {
      // Act
      const actual = hdbscan.fit([]);

      // Assert
      expect(actual).toBeEmpty();
    });
  });
});
