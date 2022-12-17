import { ColorSpaceName } from '../../types';

import { colorSpace } from './index';

describe('color/space', () => {
  describe('colorModel', () => {
    it.each([{ name: 'lab' }, { name: 'hsl' }, { name: 'rgb' }, { name: 'xyz' }])(
      'should return color space by name($name)',
      ({ name }) => {
        // Act
        const actual = colorSpace(name as ColorSpaceName);

        // Assert
        expect(actual).toBeDefined();
      },
    );

    it('should throw TypeError if the name is unrecognized', () => {
      // Assert
      expect(() => {
        // Act
        colorSpace('unrecognized' as ColorSpaceName);
      }).toThrowError(TypeError);
    });
  });
});
