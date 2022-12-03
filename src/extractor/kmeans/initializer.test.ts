import { Point2 } from '../../math';

import { createInitializer, InitializerName } from './initializer';

describe('initializer', () => {
  const points: Point2[] = [
    [0, 0],
    [1, 0],
    [2, 1],
    [4, 2],
    [4, 8],
    [8, 8],
  ];

  describe('KmeansPlusPlusInitializer', () => {
    it.each([
      { count: 1, expected: 1 },
      { count: 2, expected: 2 },
      { count: 4, expected: 4 },
      { count: 6, expected: 6 },
      { count: 8, expected: 6 },
    ])('should return initial $count point(s)', ({ count, expected }) => {
      // Act
      const initializer = createInitializer('kmeans++');
      const actual = initializer.initialize(points, count);

      // Assert
      expect(actual).toBeArrayOfSize(expected);
      expect(actual).toIncludeAnyMembers(points);
    });

    it.each([{ count: -1 }, { count: 0 }, { count: NaN }])(
      'should throw TypeError if count($count) is invalid',
      ({ count }) => {
        // Act
        const initializer = createInitializer('kmeans++');

        // Assert
        expect(() => {
          initializer.initialize(points, count);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('RandomInitializer', () => {
    it.each([
      { count: 1, expected: 1 },
      { count: 2, expected: 2 },
      { count: 4, expected: 4 },
      { count: 6, expected: 6 },
      { count: 8, expected: 6 },
    ])('should return initial $count point(s)', ({ count, expected }) => {
      // Act
      const initializer = createInitializer('random');
      const actual = initializer.initialize(points, count);

      // Assert
      expect(actual).toBeArrayOfSize(expected);
      expect(actual).toIncludeAnyMembers(points);
    });

    it.each([{ count: -1 }, { count: 0 }, { count: NaN }])(
      'should throw TypeError if count($count) is invalid',
      ({ count }) => {
        // Act
        const initializer = createInitializer('random');

        // Assert
        expect(() => {
          initializer.initialize(points, count);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('createInitializer', () => {
    it.each([{ name: 'kmeans++' }, { name: 'random' }])('should return $name initializer', ({ name }) => {
      // Act
      const actual = createInitializer(name as InitializerName);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw TypeError if name is unrecognized', () => {
      // Assert
      expect(() => {
        // Act
        createInitializer('unknown' as InitializerName);
      }).toThrowError(TypeError);
    });
  });
});
