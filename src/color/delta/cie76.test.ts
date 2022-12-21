import { HSLColor } from '../hsl';

import { cie76 } from './cie76';

describe('cie76', () => {
  it.each([
    { hsl1: { h: 0, s: 0.0, l: 0.0 }, hsl2: { h: 0, s: 0.0, l: 0.0 }, expected: 0.0 },
    { hsl1: { h: 0, s: 0.0, l: 0.0 }, hsl2: { h: 0, s: 0.0, l: 0.1 }, expected: 9.26 },
    { hsl1: { h: 0, s: 0.0, l: 0.0 }, hsl2: { h: 0, s: 0.0, l: 1.0 }, expected: 100.0 },
    { hsl1: { h: 120, s: 1.0, l: 0.5 }, hsl2: { h: 180, s: 1.0, l: 0.5 }, expected: 104.56 },
    { hsl1: { h: 8, s: 0.82, l: 0.56 }, hsl2: { h: 7, s: 0.88, l: 0.56 }, expected: 6.32 },
  ])('should compute DeltaE($expected) between HSL($hsl1) to HSL($hsl2)', ({ hsl1, hsl2, expected }) => {
    // Act
    const color1 = new HSLColor(hsl1.h, hsl1.s, hsl1.l, 1.0);
    const color2 = new HSLColor(hsl2.h, hsl2.s, hsl2.l, 1.0);
    const actual = cie76(color1, color2);

    // Assert
    expect(actual).toBeCloseTo(expected);
  });
});
