# Auto Palette

## Table of contents

### Classes

- [Color](classes/Color.md)
- [Palette](classes/Palette.md)

### Interfaces

- [Options](interfaces/Options.md)
- [Swatch](interfaces/Swatch.md)

### Type Aliases

- [ColorDelta](README.md#colordelta)
- [ColorDeltaMeasure](README.md#colordeltameasure)
- [ColorFilter](README.md#colorfilter)
- [ImageSource](README.md#imagesource)
- [Algorithm](README.md#algorithm)
- [Theme](README.md#theme)

### Functions

- [cie76](README.md#cie76)
- [cie94](README.md#cie94)
- [ciede2000](README.md#ciede2000)
- [opacityFilter](README.md#opacityfilter)
- [luminanceFilter](README.md#luminancefilter)

## Type Aliases

### ColorDelta

Ƭ **ColorDelta**: `number` & \{ `[validDifference]`: ``true``  }

ColorDelta type represents a color difference.

___

### ColorDeltaMeasure

Ƭ **ColorDeltaMeasure**\<`T`\>: (`color1`: `T`, `color2`: `T`) => [`ColorDelta`](README.md#colordelta)

ColorDeltaMeasure calculates the color difference between two colors.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `ColorType` | The color type. |

#### Type declaration

▸ (`color1`, `color2`): [`ColorDelta`](README.md#colordelta)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `T` | The 1st color. |
| `color2` | `T` | The 2nd color. |

##### Returns

[`ColorDelta`](README.md#colordelta)

___

### ColorFilter

Ƭ **ColorFilter**: (`color`: `RGBA`) => `boolean`

Color filter function that filters colors.

#### Type declaration

▸ (`color`): `boolean`

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `RGBA` | The color to test. |

##### Returns

`boolean`

___

### ImageSource

Ƭ **ImageSource**: `HTMLCanvasElement` \| `HTMLImageElement` \| `ImageData`

Image source represents the source of a supported image.

___

### Algorithm

Ƭ **Algorithm**: ``"dbscan"`` \| ``"kmeans"``

The algorithm to use for palette extraction.
dbscan: Density-based spatial clustering of applications with noise(DBSCAN) clustering.
kmeans: K-means clustering.

**`See`**

 - [DBSCAN - Wikipedia](https://en.wikipedia.org/wiki/DBSCAN)
 - [k-means clustering - Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)

___

### Theme

Ƭ **Theme**: ``"basic"`` \| ``"vivid"`` \| ``"muted"`` \| ``"light"`` \| ``"dark"``

Theme type represents a color theme.
- basic: The theme with basic colors.
- vivid: The theme with vivid colors.
- muted: The theme with muted colors.
- light: The theme with light colors.
- dark: The theme with dark colors.

## Functions

### cie76

▸ **cie76**(`color1`, `color2`): [`ColorDelta`](README.md#colordelta)

Calculate the color difference between two colors using the CIE76 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `LAB` | The 1st color. |
| `color2` | `LAB` | The 2nd color. |

#### Returns

[`ColorDelta`](README.md#colordelta)

The color difference.

**`See`**

[CIE75 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE76)

___

### cie94

▸ **cie94**(`color1`, `color2`): [`ColorDelta`](README.md#colordelta)

Calculate the color difference between two colors using the CIE94 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `LAB` | The 1st color. |
| `color2` | `LAB` | The 2nd color. |

#### Returns

[`ColorDelta`](README.md#colordelta)

The color difference.

**`See`**

[CIE94 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE94)

___

### ciede2000

▸ **ciede2000**(`color1`, `color2`): [`ColorDelta`](README.md#colordelta)

Calculate the color difference between two colors using the CIEDE2000 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `LAB` | The 1st color. |
| `color2` | `LAB` | The 2nd color. |

#### Returns

[`ColorDelta`](README.md#colordelta)

The color difference.

**`See`**

[CIEDE2000 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)

___

### opacityFilter

▸ **opacityFilter**(`threshold?`): [`ColorFilter`](README.md#colorfilter)

Create a new color filter function that checks the opacity of the color.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `threshold` | `number` | `1.0` | The minimum alpha value to pass the filter. The value must be in [0.0, 1.0]. |

#### Returns

[`ColorFilter`](README.md#colorfilter)

The color filter function.

**`Throws`**

If the threshold is not within the range [0.0, 1.0].

___

### luminanceFilter

▸ **luminanceFilter**(`minThreshold?`, `maxThreshold?`): [`ColorFilter`](README.md#colorfilter)

Create a new color filter function that checks the luminance of the color.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `minThreshold` | `number` | `DEFAULT_MIN_LUMINANCE` | The minimum luminance value to pass the filter. The value must be in [0.0, 1.0]. |
| `maxThreshold` | `number` | `DEFAULT_MAX_LUMINANCE` | The maximum luminance value to pass the filter. The value must be in [0.0, 1.0]. |

#### Returns

[`ColorFilter`](README.md#colorfilter)

The color filter function.

**`Throws`**

If the minThreshold or maxThreshold is not within the range [0.0, 1.0].

**`Throws`**

If the minThreshold is greater than the maxThreshold.
