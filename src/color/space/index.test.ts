import { describe, expect, it } from 'vitest';

import { HSLColorSpace } from './hsl';
import { LabColorSpace } from './lab';
import { RGBColorSpace } from './rgb';
import { XYZColorSpace } from './xyz';

import { hsl, lab, rgb, xyz } from './index';

describe('color/space', () => {
  it('should create HSL color space', () => {
    // Act
    const actual = hsl();

    // Assert
    expect(actual).toBeInstanceOf(HSLColorSpace);
  });

  it('should create CIE L*a*b* color space', () => {
    // Act
    const actual = lab();

    // Assert
    expect(actual).toBeInstanceOf(LabColorSpace);
  });

  it('should create RGB color space', () => {
    // Act
    const actual = rgb();

    // Assert
    expect(actual).toBeInstanceOf(RGBColorSpace);
  });

  it('should create CIE XYZ color space', () => {
    // Act
    const actual = xyz();

    // Assert
    expect(actual).toBeInstanceOf(XYZColorSpace);
  });
});
