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

The maximum number of swatches to extract. Default is 256.

___

### filters

• `Optional` `Readonly` **filters**: [`ColorFilter`](../README.md#colorfilter)[]

The color filter functions. Default is [opacityFilter(), luminanceFilter()].

**`See`**

 - [opacityFilter](../README.md#opacityfilter)
 - [luminanceFilter](../README.md#luminancefilter)
