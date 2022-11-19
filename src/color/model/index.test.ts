import { ColorModel, colorModel } from './index';

describe('color/model', () => {
  describe('colorModel', () => {
    it.each([{ name: 'hsl' }, { name: 'rgb' }])('should return color model by name($name)', ({ name }) => {
      // Act
      const actual = colorModel(name as ColorModel);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw TypeError if the name is unrecognized', () => {
      // Assert
      expect(() => {
        // Act
        colorModel('unrecognized' as ColorModel);
      }).toThrowError(TypeError);
    });
  });
});