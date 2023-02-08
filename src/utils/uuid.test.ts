import { describe, expect, it } from 'vitest';

import { uuid } from './uuid';

describe('UUID', () => {
  describe('uuid', () => {
    it('should generate a new UUID v4', () => {
      // Act
      const actual = uuid();

      // Assert
      expect(actual).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
  });
});
