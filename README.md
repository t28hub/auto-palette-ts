# Auto Palette

[![GitHub Actions](https://github.com/t28hub/auto-palette/actions/workflows/build.yml/badge.svg)](https://github.com/t28hub/c10e/actions/workflows/build.yml)
[![CodeCov](https://codecov.io/gh/t28hub/auto-palette/branch/main/graph/badge.svg?token=F5obdWWvEt)](https://codecov.io/gh/t28hub/auto-palette)
[![Codacy](https://app.codacy.com/project/badge/Grade/f133835017b04752aa3758dc62a8602e)](https://www.codacy.com/gh/t28hub/auto-palette/dashboard?utm_source=github.com&utm_medium=referral&utm_content=t28hub/auto-palette&utm_campaign=Badge_Grade)
[![FOSSA](https://app.fossa.com/api/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette.svg?type=shield)](https://app.fossa.com/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette?ref=badge_shield)

## Usage

```typescript
import { palette } from 'auto-palette';

palette(image)
  .build({ maxColors: 8 })
  .then((result) => {
    const dominantSwatch = result.getDominantSwatch();
    console.info(`Dominant swatch: ${dominantSwatch}`);
  })
  .catch((reason) => {
    console.warn(`Failed to build a palette: ${reason}`);
  });
```

## License

This library is distributed under the MIT License.See the [LICENSE](https://github.com/t28hub/auto-palette/blob/main/LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette.svg?type=large)](https://app.fossa.com/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette?ref=badge_large)
