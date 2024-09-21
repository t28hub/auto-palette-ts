# Auto Palette

> Auto Palette is a library that automatically extracts a prominent color palette from your image.

[![NPM Version](https://img.shields.io/npm/v/auto-palette)](https://www.npmjs.com/package/auto-palette)
[![License](https://img.shields.io/npm/l/auto-palette)](https://github.com/t28hub/auto-palette-ts/blob/main/LICENSE)
[![GitHub Actions](https://github.com/t28hub/auto-palette-ts/actions/workflows/build.yml/badge.svg)](https://github.com/t28hub/auto-palette-ts/actions/workflows/build.yml)
[![Codacy](https://app.codacy.com/project/badge/Grade/f133835017b04752aa3758dc62a8602e)](https://app.codacy.com/gh/t28hub/auto-palette-ts/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codecov](https://codecov.io/gh/t28hub/auto-palette-ts/graph/badge.svg?token=F5obdWWvEt)](https://codecov.io/gh/t28hub/auto-palette-ts)
[![FOSSA](https://app.fossa.com/api/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts.svg?type=shield&issueType=license)](https://app.fossa.com/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts?ref=badge_shield&issueType=license)

## Features

![Color palette extracted from an image using Auto Palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/palette.webp)

> [!NOTE]
> Photo by Pixabay from Pexels: https://www.pexels.com/photo/yellow-pink-and-violet-tulips-52508/

❯ Automatically extracts color palette from image<br>
❯ Provides detailed color information color, name, position and population<br>
❯ Supports multiple color extraction algorithms (`dbscan`, `kmeans` )<br>
❯ Supports multiple image sources (`HTMLImageElement`, `HTMLCanvasElement`, `ImageData`)<br>
❯ Supports both Browser and Node.js<br>
❯ Zero dependencies<br>

## Installation

Using npm:

```bash
$ npm install auto-palette
```

Using yarn:

```bash
$ yarn add auto-palette
```

Using pnpm:

```bash
$ pnpm add auto-palette
```

## Usage

```ts
// ESM
import { Palette } from 'auto-palette';

// CJS
const { Palette } = require('auto-palette');

const palette = Palette.extract(image);
const swatches = palette.findSwatches(8, 'vivid');
for (const swatch of swatches) {
  console.log({
    name: swatch.name,              // The similar color name of the swatch
    color: swatch.color.toString(), // The color of the swatch
    position: swatch.position,      // The position of the swatch in the image
    population: swatch.population,  // The pixel count of the swatch
  });
}
```

## Examples

|                                                                                                          Source Image                                                                                                          |                                                             Default                                                             |                                                            Vivid                                                            |                                                            Muted                                                            |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
|               [![Yellow Pink and Violet Tulips](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-52508.webp)](https://www.pexels.com/photo/yellow-pink-and-violet-tulips-52508/)               |  ![Default color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-52508-default.webp)  |  ![Vivid color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-52508-vivid.webp)  |  ![Muted color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-52508-muted.webp)  |
|                [![Closeup photo of doughnuts](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1191639.webp)](https://www.pexels.com/photo/closeup-photo-of-doughnuts-1191639/)                | ![Default color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1191639-default.webp) | ![Vivid color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1191639-vivid.webp) | ![Muted color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1191639-muted.webp) |
| [![Close-up Photo of Assorted Colored Chalks](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1153895.webp)](https://www.pexels.com/photo/close-up-photo-of-assorted-colored-chalks-1153895/) | ![Default color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1153895-default.webp) | ![Vivid color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1153895-vivid.webp) | ![Muted color palette](https://raw.githubusercontent.com/t28hub/auto-palette-ts/main/docs/assets/pexels-1153895-muted.webp) |

## API

For more detailed information, please refer to
the [documentations](https://github.com/t28hub/auto-palette-ts/tree/main/docs) in the `docs` directory.

### Palette

#### `extract(image: ImageSource, options?: Options): Palette`

Extracts a color palette from the given image source(HTMLImageElement, HTMLCanvasElement or ImageData).  
It takes an image source and an optional `Options` object as parameters.

```ts
const options: Options = {
  algorithm: 'dbscan',
  samplingRate: 0.5,
  maxSwatches: 16,
  filters: [luminanceFilter(0.2, 0.8)],
};
const palette = Palette.extract(image, options);
```

The `Options` can include properties such as `algorithm`, `samplingRate`, `maxSwatches`, and `filters`.

```ts
interface Options {
  // The color extraction algorithm to use. Default is 'dbscan'.
  algorithm?: 'dbscan' | 'kmeans';
  // The sampling rate of the image. Default is 1.0.
  samplingRate?: number;
  // The maximum number of swatches to extract. Default is 256.
  maxSwatches?: number;
  // The color filters to apply. Default is [opacityFilter()].
  filters?: ColorFilter[];
}
```

#### `findSwatches(n: number, theme?: Theme): Swatch[]`

Finds the best `n` swatches in the palette.  
The “best” swatches are determined based on their population and optionally a theme.
The theme can be `basic`, `vivid`, `muted`, `light` or `dark`. Default is `basic`.

```ts
const swatches = palette.findSwatches(5, 'light');
```

## Development

Follow these steps to get started with development:

1. Fork and clone this repository
2. Install the latest LTS version of [Node.js](https://nodejs.org/en)
3. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
4. Install dependencies using `pnpm install`
5. Run unit tests and watch for changes using `pnpm dev`

## License

This library is distributed under the MIT License.See
the [LICENSE](https://github.com/t28hub/auto-palette-ts/blob/main/LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts.svg?type=large&issueType=license)](https://app.fossa.com/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts?ref=badge_large&issueType=license)
