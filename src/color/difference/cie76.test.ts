import { describe, expect, it } from 'vitest';

import { cie76 } from './cie76';

describe('CIE76', () => {
  it('should return the color difference between two colors using the CIE76 formula', () => {
    // Act
    const lab1 = { l: 50.0, a: 2.6772, b: -79.7751 };
    const lab2 = { l: 50.0, a: 0.0, b: -82.7485 };
    const actual = cie76(lab1, lab2);

    // Assert
    expect(actual).toBeCloseTo(4.0011, 4);
  });
});
