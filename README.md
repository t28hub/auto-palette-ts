# Auto Palette

[![Build project](https://github.com/t28hub/auto-palette/actions/workflows/build.yml/badge.svg)](https://github.com/t28hub/c10e/actions/workflows/build.yml)

## Usage

```typescript
import * as AutoPalette from 'auto-palette';

AutoPalette.palette(image)
  .build({ maxColors: 8 })
  .then((result) => {
    const dominantColor = result.getDominantColor();
    console.info(`Dominant color: ${dominantColor}`);
  })
  .catch((reason) => {
    console.warn(`Failed to build a palette: ${reason}`);
  });
```

## License

This library is distributed under the MIT License.  
See the [LICENSE](https://github.com/t28hub/auto-palette/blob/main/LICENSE) for more details.
