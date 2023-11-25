import { describe, expect, it } from 'vitest';

import { cie94 } from './cie94';

describe('CIE94', () => {
  it('should return the color difference between two colors using the CIE94 formula', () => {
    // Act
    const lab1 = { l: 50.0, a: 2.6772, b: -79.7751 };
    const lab2 = { l: 50.0, a: 0.0, b: -82.7485 };
    const actual = cie94(lab1, lab2);

    // Assert
    expect(actual).toBeCloseTo(1.395, 4);
  });
});
