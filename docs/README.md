# Auto Palette

## Table of contents

### Classes

- [Color](classes/Color.md)
- [Palette](classes/Palette.md)

### Interfaces

- [Options](interfaces/Options.md)
- [Swatch](interfaces/Swatch.md)

### Type Aliases

- [ColorDifference](README.md#colordifference)
- [DifferenceFunction](README.md#differencefunction)
- [ColorFilterFunction](README.md#colorfilterfunction)
- [ImageSource](README.md#imagesource)
- [Algorithm](README.md#algorithm)
- [Theme](README.md#theme)

### Functions

- [cie76](README.md#cie76)
- [cie94](README.md#cie94)
- [ciede2000](README.md#ciede2000)
- [alphaFilter](README.md#alphafilter)
- [luminanceFilter](README.md#luminancefilter)

## Type Aliases

### ColorDifference

Ƭ **ColorDifference**: `number` & \{ `[validDifference]`: ``true``  }

Color difference type represents a color difference.

___

### DifferenceFunction

Ƭ **DifferenceFunction**\<`T`\>: (`color1`: `T`, `color2`: `T`) => [`ColorDifference`](README.md#colordifference)

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `ColorType` | The color type. |

#### Type declaration

▸ (`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Difference function calculates the color difference between two colors.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `T` | The 1st color. |
| `color2` | `T` | The 2nd color. |

##### Returns

[`ColorDifference`](README.md#colordifference)

The color difference between the two colors.

___

### ColorFilterFunction

Ƭ **ColorFilterFunction**: (`color`: `RGBA`) => `boolean`

#### Type declaration

▸ (`color`): `boolean`

Color filter function that filters colors.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `RGBA` | The color to test. |

##### Returns

`boolean`

True if the color passes the filter, false otherwise.

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

Ƭ **Theme**: ``"vivid"`` \| ``"muted"`` \| ``"light"`` \| ``"dark"``

Theme type represents a color theme.
- vivid: The theme with vivid colors.
- muted: The theme with muted colors.
- light: The theme with light colors.
- dark: The theme with dark colors.

## Functions

### cie76

▸ **cie76**(`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Calculate the color difference between two colors using the CIE76 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `LAB` | The 1st color. |
| `color2` | `LAB` | The 2nd color. |

#### Returns

[`ColorDifference`](README.md#colordifference)

The color difference.

**`See`**

[CIE75 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE76)

___

### cie94

▸ **cie94**(`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Calculate the color difference between two colors using the CIE94 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `LAB` | The 1st color. |
| `color2` | `LAB` | The 2nd color. |

#### Returns

[`ColorDifference`](README.md#colordifference)

The color difference.

**`See`**

[CIE94 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE94)

___

### ciede2000

▸ **ciede2000**(`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Calculate the color difference between two colors using the CIEDE2000 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `LAB` | The 1st color. |
| `color2` | `LAB` | The 2nd color. |

#### Returns

[`ColorDifference`](README.md#colordifference)

The color difference.

**`See`**

[CIEDE2000 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)

___

### alphaFilter

▸ **alphaFilter**(`threshold?`): [`ColorFilterFunction`](README.md#colorfilterfunction)

Create a new color filter function that checks the alpha value of the color.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `threshold` | `number` | `1.0` | The minimum alpha value to pass the filter. The value must be in [0.0, 1.0]. |

#### Returns

[`ColorFilterFunction`](README.md#colorfilterfunction)

The color filter function.

**`Throws`**

If the threshold is not within the range [0.0, 1.0].

___

### luminanceFilter

▸ **luminanceFilter**(`minThreshold?`, `maxThreshold?`): [`ColorFilterFunction`](README.md#colorfilterfunction)

Create a new color filter function that checks the luminance of the color.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `minThreshold` | `number` | `DEFAULT_MIN_LUMINANCE` | The minimum luminance value to pass the filter. The value must be in [0.0, 1.0]. |
| `maxThreshold` | `number` | `DEFAULT_MAX_LUMINANCE` | The maximum luminance value to pass the filter. The value must be in [0.0, 1.0]. |

#### Returns

[`ColorFilterFunction`](README.md#colorfilterfunction)

The color filter function.

**`Throws`**

If the minThreshold or maxThreshold is not within the range [0.0, 1.0].

**`Throws`**

If the minThreshold is greater than the maxThreshold.
