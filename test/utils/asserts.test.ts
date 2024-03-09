import {
  assert,
  AssertionError,
  assertDefined,
  assertFiniteNumber,
  assertInteger,
  assertPositiveInteger,
  assertRange,
} from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('asserts', () => {
  describe('AssertionError', () => {
    describe('constructor', () => {
      it('should create a new AssertionError instance', () => {
        // Act
        const actual = new AssertionError('The value is invalid');

        // Assert
        expect(actual).toBeDefined();
      });
    });
  });

  describe('assert', () => {
    it('should throw an AssertionError if the condition is false', () => {
      // Assert
      expect(() => {
        // Act
        assert(false, 'The condition is false');
      }).toThrowError(new AssertionError('The condition is false'));
    });

    it('should not throw an AssertionError if the condition is true', () => {
      // Assert
      expect(() => {
        // Act
        assert(true, 'The condition is true');
      }).not.toThrowError();
    });
  });

  describe('assertDefined', () => {
    it('should throw an AssertionError if the value is undefined', () => {
      // Assert
      expect(() => {
        // Act
        assertDefined(undefined, 'The value is undefined');
      }).toThrowError(new AssertionError('The value is undefined'));
    });

    it('should throw an AssertionError if the value is null', () => {
      // Assert
      expect(() => {
        // Act
        assertDefined(null, 'The value is null');
      }).toThrowError(new AssertionError('The value is null'));
    });

    it('should not throw an AssertionError if the value is defined', () => {
      // Assert
      expect(() => {
        // Act
        assertDefined(1, 'The value is defined');
      }).not.toThrowError();
    });
  });

  describe('assertFiniteNumber', () => {
    it('should throw an AssertionError if the value is not a number', () => {
      // Assert
      expect(() => {
        // Act
        assertFiniteNumber('1', 'The value is not a number');
      }).toThrowError(new AssertionError('The value is not a number'));
    });

    it('should throw an AssertionError if the value is not finite', () => {
      // Assert
      expect(() => {
        // Act
        assertFiniteNumber(Number.POSITIVE_INFINITY, 'The value is not finite');
      }).toThrowError(new AssertionError('The value is not finite'));
    });

    it('should not throw an AssertionError if the value is a finite number', () => {
      // Assert
      expect(() => {
        // Act
        assertFiniteNumber(1, 'The value is a finite number');
      }).not.toThrowError();
    });
  });

  describe('assertInteger', () => {
    it('should throw an AssertionError if the value is not a number', () => {
      // Assert
      expect(() => {
        // Act
        assertInteger('1', 'The value is not a number');
      }).toThrowError(new AssertionError('The value is not a number'));
    });

    it('should throw an AssertionError if the value is not an integer', () => {
      // Assert
      expect(() => {
        // Act
        assertInteger(1.1, 'The value is not an integer');
      }).toThrowError(new AssertionError('The value is not an integer'));
    });

    it('should not throw an AssertionError if the value is an integer', () => {
      // Assert
      expect(() => {
        // Act
        assertInteger(1, 'The value is an integer');
      }).not.toThrowError();
    });
  });

  describe('assertPositiveInteger', () => {
    it('should throw an AssertionError if the value is not a number', () => {
      // Assert
      expect(() => {
        // Act
        assertPositiveInteger('1', 'The value is not a number');
      }).toThrowError(new AssertionError('The value is not a number'));
    });

    it('should throw an AssertionError if the value is not an integer', () => {
      // Assert
      expect(() => {
        // Act
        assertPositiveInteger(1.1, 'The value is not an integer');
      }).toThrowError(new AssertionError('The value is not an integer'));
    });

    it('should throw an AssertionError if the value is not positive', () => {
      // Assert
      expect(() => {
        // Act
        assertPositiveInteger(-1, 'The value is not positive');
      }).toThrowError(new AssertionError('The value is not positive'));
    });

    it('should not throw an AssertionError if the value is a positive integer', () => {
      // Assert
      expect(() => {
        // Act
        assertPositiveInteger(1, 'The value is a positive integer');
      }).not.toThrowError();
    });
  });

  describe('assertRange', () => {
    it('should throw an AssertionError if the value is not a number', () => {
      // Assert
      expect(() => {
        // Act
        assertRange('1', 0, 10, 'The value is not a number');
      }).toThrowError(new AssertionError('The value is not a number'));
    });

    it('should throw an AssertionError if the value is not in the range', () => {
      // Assert
      expect(() => {
        // Act
        assertRange(11, 0, 10, 'The value is not in the range');
      }).toThrowError(new AssertionError('The value is not in the range'));
    });

    it('should not throw an AssertionError if the value is in the range', () => {
      // Assert
      expect(() => {
        // Act
        assertRange(1, 0, 10, 'The value is in the range');
      }).not.toThrowError();
    });
  });
});
