import { SquaredEuclideanDistance } from './distance';
import { Vector3 } from './vector3';

describe('Vector3', () => {
  it('should instantiate with components', () => {
    // Act
    const actual = new Vector3(1, 2, 3);

    // Assert
    expect(actual).toMatchObject({
      dimension: 3,
      components: [1, 2, 3],
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.toString();

      // Assert
      expect(actual).toBe('Vector(1, 2, 3)');
    });
  });

  describe('toArray', () => {
    it('should return array representation', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.toArray();

      // Assert
      expect(actual).toEqual([1, 2, 3]);
    });
  });

  describe('setZero', () => {
    it('should set vector to zero vector', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.setZero();

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: [0, 0, 0],
      });
    });
  });

  describe('add', () => {
    it('should add the other vector', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const other = new Vector3(3, 4, 5);
      const actual = vector.add(other);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: [4, 6, 8],
      });
    });

    it('should add the other pixel', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.add([4, 5, 6]);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: [5, 7, 9],
      });
    });

    it('should throw TypeError if the given pixel contains infinite number', () => {
      const vector = new Vector3(1, 2, 3);

      // Assert
      expect(() => {
        // Act
        vector.add([4, 5, NaN]);
      }).toThrowError(TypeError);
    });
  });

  describe('scale', () => {
    it.each([
      { scalar: 0.0, expected: [0, 0, 0] },
      { scalar: 1.0, expected: [1, 2, 3] },
      { scalar: 2.0, expected: [2, 4, 6] },
      { scalar: -1.0, expected: [-1, -2, -3] },
      { scalar: -2.0, expected: [-2, -4, -6] },
      { scalar: 0.5, expected: [1 / 2, 2 / 2, 3 / 2] },
      { scalar: 0.25, expected: [1 / 4, 2 / 4, 3 / 4] },
    ])('should scale by the scalar(%d)', ({ scalar, expected }) => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.scale(scalar);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: expected,
      });
    });

    it.each([{ scalar: NaN }, { scalar: Number.POSITIVE_INFINITY }, { scalar: Number.NEGATIVE_INFINITY }])(
      'should throw TypeError if the given scalar(%d) is not finite number',
      ({ scalar }) => {
        const vector = new Vector3(1, 2, 3);

        // Assert
        expect(() => {
          vector.scale(scalar);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('distanceTo', () => {
    it('should compute distance to the other vector', () => {
      // Act
      const vector1 = new Vector3(1, 2, 3);
      const vector2 = new Vector3(4, 5, 6);
      const actual = vector1.distanceTo(vector2);

      // Assert
      expect(actual).toEqual(Math.sqrt(27));
    });

    it('should compute distance to the other point', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.distanceTo([3, 4, 5]);

      // Assert
      expect(actual).toEqual(Math.sqrt(12));
    });

    it('should compute distance with the distance measure to the other point', () => {
      // Act
      const vector = new Vector3(1, 2, 3);
      const actual = vector.distanceTo([3, 4, 5], SquaredEuclideanDistance);

      // Assert
      expect(actual).toEqual(12);
    });
  });
});
