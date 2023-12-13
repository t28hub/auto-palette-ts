# auto-palette

## Classes

- [Color](classes/Color.md)
- [Palette](classes/Palette.md)

## Interfaces

- [Options](interfaces/Options.md)
- [Position](interfaces/Position.md)
- [Swatch](interfaces/Swatch.md)

## Type Aliases

### Algorithm

Ƭ **Algorithm**: ``"dbscan"`` \| ``"kmeans"``

The algorithm to use for palette extraction.
dbscan: Density-based spatial clustering of applications with noise(DBSCAN) clustering.
kmeans: K-means clustering.

**`See`**

 - [DBSCAN - Wikipedia](https://en.wikipedia.org/wiki/DBSCAN)
 - [k-means clustering - Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)

#### Defined in

[palette.ts:32](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L32)

___

### ColorDifference

Ƭ **ColorDifference**: `number` & \{ `[validDifference]`: ``true``  }

Color difference type represents a color difference.

#### Defined in

[color/difference/function.ts:8](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/difference/function.ts#L8)

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

#### Defined in

[filter.ts:10](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/filter.ts#L10)

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

#### Defined in

[color/difference/function.ts:20](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/difference/function.ts#L20)

___

### HSL

Ƭ **HSL**: `Object`

HSL type represents a color in HSL color space.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `h` | `number` | The hue value in degrees [0, 360). |
| `l` | `number` | The lightness value in [0.0, 1.0]. |
| `s` | `number` | The saturation value in [0.0, 1.0]. |

#### Defined in

[color/types.ts:4](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/types.ts#L4)

___

### ImageSource

Ƭ **ImageSource**: `HTMLCanvasElement` \| `HTMLImageElement` \| `ImageData`

Image source represents the source of a supported image.

#### Defined in

[image.ts:6](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/image.ts#L6)

___

### LAB

Ƭ **LAB**: `Object`

LAB type represents a color in CIELab color space.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | The a value in [-128, 127]. |
| `b` | `number` | The b value in [-128, 127]. |
| `l` | `number` | The lightness value in [0, 100]. |

#### Defined in

[color/types.ts:24](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/types.ts#L24)

___

### RGB

Ƭ **RGB**: `Object`

RGB type represents a color in RGB color space.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `b` | `number` | The blue value in [0, 255]. |
| `g` | `number` | The green value in [0, 255]. |
| `r` | `number` | The red value in [0, 255]. |

#### Defined in

[color/types.ts:44](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/types.ts#L44)

___

### Theme

Ƭ **Theme**: ``"vivid"`` \| ``"muted"`` \| ``"light"`` \| ``"dark"``

Theme type represents a color theme.
- vivid: The theme with vivid colors.
- muted: The theme with muted colors.
- light: The theme with light colors.
- dark: The theme with dark colors.

#### Defined in

[theme.ts:12](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/theme.ts#L12)

___

### XYZ

Ƭ **XYZ**: `Object`

XYZ type represents a color in XYZ color space.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The x value in [0.0, 0.950456]. |
| `y` | `number` | The y value in [0.0, 1.0]. |
| `z` | `number` | The z value in [0.0, 1.088644]. |

#### Defined in

[color/types.ts:64](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/types.ts#L64)

## Functions

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

#### Defined in

[filter.ts:19](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/filter.ts#L19)

___

### cie76

▸ **cie76**(`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Calculate the color difference between two colors using the CIE76 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | [`LAB`](README.md#lab) | The 1st color. |
| `color2` | [`LAB`](README.md#lab) | The 2nd color. |

#### Returns

[`ColorDifference`](README.md#colordifference)

The color difference.

**`See`**

[CIE75 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE76)

#### Defined in

[color/difference/function.ts:20](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/difference/function.ts#L20)

___

### cie94

▸ **cie94**(`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Calculate the color difference between two colors using the CIE94 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | [`LAB`](README.md#lab) | The 1st color. |
| `color2` | [`LAB`](README.md#lab) | The 2nd color. |

#### Returns

[`ColorDifference`](README.md#colordifference)

The color difference.

**`See`**

[CIE94 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIE94)

#### Defined in

[color/difference/function.ts:20](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/difference/function.ts#L20)

___

### ciede2000

▸ **ciede2000**(`color1`, `color2`): [`ColorDifference`](README.md#colordifference)

Calculate the color difference between two colors using the CIEDE2000 formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | [`LAB`](README.md#lab) | The 1st color. |
| `color2` | [`LAB`](README.md#lab) | The 2nd color. |

#### Returns

[`ColorDifference`](README.md#colordifference)

The color difference.

**`See`**

[CIEDE2000 - Color difference](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)

#### Defined in

[color/difference/function.ts:20](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/difference/function.ts#L20)

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

#### Defined in

[filter.ts:47](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/filter.ts#L47)
