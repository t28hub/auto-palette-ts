# Interface: Options

Options interface for palette extraction.

**`See`**

[Palette.extract](../classes/Palette.md#extract)

## Properties

### algorithm

• `Optional` `Readonly` **algorithm**: [`Algorithm`](../README.md#algorithm)

The algorithm to use for palette extraction. Default is dbscan.

#### Defined in

[palette.ts:43](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L43)

___

### filters

• `Optional` `Readonly` **filters**: [`ColorFilterFunction`](../README.md#colorfilterfunction)[]

The color filter functions. Default is [alphaFilter(), luminanceFilter()].

**`See`**

 - [alphaFilter](../README.md#alphafilter)
 - [luminanceFilter](../README.md#luminancefilter)

#### Defined in

[palette.ts:61](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L61)

___

### maxSwatches

• `Optional` `Readonly` **maxSwatches**: `number`

The maximum number of swatches to extract in the range of (0, 256]. Default is 32.

#### Defined in

[palette.ts:53](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L53)

___

### samplingRate

• `Optional` `Readonly` **samplingRate**: `number`

The sampling rate to sample pixels from the image in the range of (0, 1]. Default is 1.0.

#### Defined in

[palette.ts:48](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L48)
