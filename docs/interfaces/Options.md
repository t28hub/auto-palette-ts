# Interface: Options

Options interface for palette extraction.

**`See`**

[Palette.extract](../classes/Palette.md#extract)

## Table of contents

### Properties

- [algorithm](Options.md#algorithm)
- [samplingRate](Options.md#samplingrate)
- [maxSwatches](Options.md#maxswatches)
- [filters](Options.md#filters)

## Properties

### algorithm

• `Optional` `Readonly` **algorithm**: [`Algorithm`](../README.md#algorithm)

The algorithm to use for palette extraction. Default is dbscan.

___

### samplingRate

• `Optional` `Readonly` **samplingRate**: `number`

The sampling rate to sample pixels from the image in the range of (0, 1]. Default is 1.0.

___

### maxSwatches

• `Optional` `Readonly` **maxSwatches**: `number`

The maximum number of swatches to extract in the range of (0, 256]. Default is 32.

___

### filters

• `Optional` `Readonly` **filters**: [`ColorFilterFunction`](../README.md#colorfilterfunction)[]

The color filter functions. Default is [alphaFilter(), luminanceFilter()].

**`See`**

 - [alphaFilter](../README.md#alphafilter)
 - [luminanceFilter](../README.md#luminancefilter)