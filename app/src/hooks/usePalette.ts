import { Color, palette, ImageSource, Palette } from 'auto-palette';
import { useEffect, useState } from 'react';

export default function usePalette(image: ImageSource | undefined) {
  const [state, setState] = useState<Palette>();

  useEffect(() => {
    if (!image) {
      return;
    }

    // eslint-disable-next-line no-console
    console.time('palette');
    palette(image)
      .build()
      .then((result: Palette) => {
        result.getColors().forEach((color: Color) => {
          // eslint-disable-next-line no-console
          console.info(`%cColor(${color})`, `color: ${color.toString()}`);
        });
        setState(result);
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.warn(`Failed to build a palette: ${reason}`);
      })
      .finally(() => {
        // eslint-disable-next-line no-console
        console.timeEnd('palette');
      });
  }, [image]);

  return [state];
}
