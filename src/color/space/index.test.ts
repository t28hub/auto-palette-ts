import { HSLColorSpace } from './hsl';
import { LabColorSpace } from './lab';
import { RGBColorSpace } from './rgb';
import { XYZColorSpace } from './xyz';

import { hsl, lab, rgb, xyz } from './index';

describe('color/space', () => {
  it('should return HSLColorSpace', () => {
    // Act
    const actual = hsl();

    // Assert
    expect(actual).toEqual(HSLColorSpace);
  });

  it('should return LabColorSpace', () => {
    // Act
    const actual = lab();

    // Assert
    expect(actual).toEqual(LabColorSpace);
  });

  it('should return RGBColorSpace', () => {
    // Act
    const actual = rgb();

    // Assert
    expect(actual).toEqual(RGBColorSpace);
  });

  it('should return XYZColorSpace', () => {
    // Act
    const actual = xyz();

    // Assert
    expect(actual).toEqual(XYZColorSpace);
  });
});
