import { describe, it } from 'vitest';

import { HSLColor } from './hsl';

import { color } from './index';

describe('index', () => {
  it.each([
    {
      value: 0x00000000,
      hsl: { h: 0, s: 0.0, l: 0.0, opacity: 0.0 },
    },
    {
      value: 0xffffffff,
      hsl: { h: 0, s: 0.0, l: 1.0, opacity: 1.0 },
    },
    {
      value: '#00000000',
      hsl: { h: 0, s: 0.0, l: 0.0, opacity: 0.0 },
    },
    {
      value: '#ffffffff',
      hsl: { h: 0, s: 0.0, l: 1.0, opacity: 1.0 },
    },
    {
      value: new HSLColor(120, 1.0, 0.5, 1.0),
      hsl: { h: 120, s: 1.0, l: 0.5, opacity: 1.0 },
    },
  ])('should return $hsl from $value', ({ value, hsl }) => {
    // Act
    const actual = color(value);

    // Assert
    expect(actual).toMatchObject(hsl);
  });

  it.each([{ value: null }, { value: undefined }, { value: [] }, { value: {} }])(
    'should throw TypeError if the value($value) is not supported',
    ({ value }) => {
      // Assert
      expect(() => {
        color(value);
      }).toThrowError(TypeError);
    },
  );
});
