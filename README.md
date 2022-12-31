# Auto Palette

[![Build project](https://github.com/t28hub/auto-palette/actions/workflows/build.yml/badge.svg)](https://github.com/t28hub/c10e/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/t28hub/auto-palette/branch/main/graph/badge.svg?token=F5obdWWvEt)](https://codecov.io/gh/t28hub/auto-palette)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f133835017b04752aa3758dc62a8602e)](https://www.codacy.com/gh/t28hub/auto-palette/dashboard?utm_source=github.com&utm_medium=referral&utm_content=t28hub/auto-palette&utm_campaign=Badge_Grade)

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
