# Class: Palette

Palette class represents a color palette.

## Table of contents

### Constructors

- [constructor](Palette.md#constructor)

### Methods

- [size](Palette.md#size)
- [isEmpty](Palette.md#isempty)
- [findSwatches](Palette.md#findswatches)
- [extract](Palette.md#extract)

## Constructors

### constructor

• **new Palette**(`swatches`): [`Palette`](Palette.md)

Create a new Palette instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swatches` | [`Swatch`](../interfaces/Swatch.md)[] | The swatches of the palette. |

#### Returns

[`Palette`](Palette.md)

**`See`**

[Palette.extract](Palette.md#extract)

## Methods

### size

▸ **size**(): `number`

Return the number of swatches.

#### Returns

`number`

The number of swatches.

**`See`**

[Palette.isEmpty](Palette.md#isempty)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Check whether the palette is empty.

#### Returns

`boolean`

True if the palette is empty, false otherwise.

**`See`**

[Palette.size](Palette.md#size)

___

### findSwatches

▸ **findSwatches**(`n`, `theme?`): `NamedSwatch`[]

Find the best swatches from the palette.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `n` | `number` | `undefined` | The number of swatches to find. |
| `theme` | [`Theme`](../README.md#theme) | `'basic'` | The theme of the swatches. Default is basic. |

#### Returns

`NamedSwatch`[]

The best swatches. If the palette is empty, an empty array is returned.

**`Throws`**

If the number of swatches to find is not an integer or less than 0.

___

### extract

▸ **extract**(`source`, `options?`): [`Palette`](Palette.md)

Extract a color palette from the given image source.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | [`ImageSource`](../README.md#imagesource) | The source of the image. |
| `options` | `Partial`\<[`Options`](../interfaces/Options.md)\> | The options for palette extraction. |

#### Returns

[`Palette`](Palette.md)

A new Palette instance containing the extracted swatches.
