import { colorSpace } from '../../color';
import { ImageData } from '../../types';

import { extract } from './extract';

describe('extract', () => {
  it('should extract colors from image', () => {
    // Arrange
    const data = new ArrayBuffer(12);
    const view = new Uint8ClampedArray(data);
    // 1st pixel
    view[0] = 0xff;
    view[1] = 0x00;
    view[2] = 0x00;
    view[3] = 0xff;

    // 2nd pixel
    view[4] = 0x00;
    view[5] = 0xff;
    view[6] = 0x00;
    view[7] = 0xff;

    // 3rd pixel
    view[8] = 0x00;
    view[9] = 0xff;
    view[10] = 0x00;
    view[11] = 0xff;
    const imageData: ImageData<Uint8ClampedArray> = { height: 1, width: 3, data: view };

    // Act
    const actual = extract(imageData, 3);

    // Assert
    expect(actual).toBeArrayOfSize(3);
    expect(actual[0]).toMatchObject({
      color: colorSpace('rgb').encode({ r: 255, g: 0, b: 0, opacity: 1.0 }),
      population: 1,
    });
    expect(actual[1]).toMatchObject({
      color: colorSpace('rgb').encode({ r: 0, g: 255, b: 0, opacity: 1.0 }),
      population: 1,
    });
  });
});
